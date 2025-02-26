package helpers

import (
	"fmt"
	"habit_notify/models"
	"sync"
	"time"

	"firebase.google.com/go/v4/messaging"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var AllUsers map[primitive.ObjectID]models.User
var Duration_Notify int64 = 1800 // 30 min in sec
var NotifyMap sync.Map
var MaxTime int64 = time.Date(2025, time.January, 1, 23, 59, 59, 59, time.UTC).Unix() //end epoch of 1 jan 2025

type UserNotification struct {
	Notification *messaging.Notification
	Token        string
}

func InitVariables() {
	AllUsers = make(map[primitive.ObjectID]models.User)
}

func RunNoficationWorker() {
	go DoEvery(time.Minute, FilerAndSendNotifications)                                                         // run every minute
	go DoEvery(time.Duration(Duration_Notify)*time.Second, GetHabitRecords, ChangeImage, HabitNotDoneReminder) // run every Duration_Notify
	go DoEvery(24*time.Hour, ClearOldRecords, InactiveHabits)                                                  // run every 12 hours

	go GetHabitRecords() // this will runs for first time
}

func DoEvery(after time.Duration, f ...func()) {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("DoEvery crashed: ", err)
		}
	}()
	if len(f) == 0 {
		return
	}
	for range time.Tick(after) {
		for _, fn := range f {
			go fn()
		}
	}
}

// sends notificaion to users if they exist in NotifyMap at that epoch
func FilerAndSendNotifications() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("FilerAndSendNotifications crashed: ", err)
		}
	}()
	utcTime := time.Now().UTC()
	timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Add(time.Minute * 5).Unix() // 5 min ahead of current time
	if timeEpoch > MaxTime {
		timeEpoch -= 86400
	}
	// check if timeEpoch is in map
	res, ok := NotifyMap.Load(timeEpoch)
	if !ok {
		return
	}

	docs, ok := res.([]*UserNotification)
	if !ok {
		return
	}

	for _, doc := range docs {
		n := fmt.Sprintf("%s: %s", time.Now().Format("2006-01-02 15:04:05"), doc.Notification.Title)
		InsertRedisListLPush("habit_notification_To_Send", []string{n})
		if err := SendHabitNotification(doc); err != nil {
			continue
		}
	}
	NotifyMap.Delete(timeEpoch)
}

func GetHabitRecords() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("GetHabitRecords crashed: ", err)
		}
	}()
	utcTime := time.Now().UTC().Add(time.Minute * 5) // 5 min ahead of current time
	timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Unix()
	if timeEpoch > MaxTime {
		timeEpoch -= 86400
	}
	query := bson.M{"startTime": bson.M{"$gte": timeEpoch, "$lt": timeEpoch + Duration_Notify}, "notify": true}

	docs, f := MongoGetManyDoc("habits", query)
	if !f {
		return
	}

	for _, doc := range docs {
		dataByte, err := bson.Marshal(doc)
		if err != nil {
			continue
		}
		var habitData models.Habit
		err = bson.Unmarshal(dataByte, &habitData)
		if err != nil {
			continue
		}
		nofity := make([]int64, 0)
		if habitData.HabitType == "negative" {
			continue
		}
		switch habitData.Repeat.Name {
		case "days":
			day := int(utcTime.Weekday())
			var include bool
			for _, v := range habitData.Repeat.Value {
				if v == day {
					include = true
					break
				}
			}
			if !include {
				continue
			}
		case "dates":
			currentDate := utcTime.Day()
			currentMonth := utcTime.Month()

			var include bool
			for _, v := range habitData.Repeat.Value {
				d := time.Unix(int64(v), 0)
				if d.Day() == currentDate && d.Month() == currentMonth {
					include = true
					break
				}
			}
			if !include {
				continue
			}
		case "hours":
			rep := habitData.Repeat.Value[0] * 60
			st := habitData.StartTime
			ed := habitData.EndTime
			for ed > st {
				st = st + int64(rep)
				nofity = append(nofity, st)
			}
		case "todo":
			currentDate := utcTime.Day()
			currentMonth := utcTime.Month()
			userDate := time.Unix(habitData.StartTime, 0)
			if userDate.Day() != currentDate || userDate.Month() != currentMonth {
				continue
			}
		}
		userid := habitData.UserID
		userDetails, err := GetUserDetails(userid)
		if err != nil {
			continue
		}
		userName := userDetails.FirstName
		habitName := habitData.Name
		userPayload := &UserNotification{}
		paylod := &messaging.Notification{
			Title:    fmt.Sprintf("Hey %s, It's Time for Your Habit: %s!", userName, habitName),
			Body:     "You're just 5 minutes away from achieving your goal! Get ready and make today amazing. 💪",
			ImageURL: ImageUrl,
		}
		userPayload.Notification = paylod
		userPayload.Token = userDetails.FCMToken
		nofity = append(nofity, habitData.StartTime)

		for _, t := range nofity {
			if val, ok := NotifyMap.Load(t); !ok {
				NotifyMap.Store(t, []*UserNotification{userPayload})
			} else {
				val := val.([]*UserNotification)
				val = append(val, userPayload)
				NotifyMap.Store(t, val)
			}
		}
	}
}

func ClearOldRecords() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("ClearOldRecords crashed: ", err)
		}
	}()

	utcTime := time.Now().UTC().Add(time.Minute * -60)
	NotifyMap.Range(func(key, value interface{}) bool {
		if key.(int64) < utcTime.Unix() {
			NotifyMap.Delete(key)
		}
		return true
	})
	utcTime = utcTime.AddDate(0, 0, -2)
	t := time.Date(utcTime.Year(), utcTime.Month(), utcTime.Day(), 12, 0, 0, 0, time.UTC).UTC()
	if err := DelRedisKey(fmt.Sprintf("habitCompleted:%d", t.Unix())); err != nil {
		return
	}
}

// this function sends notification to user if habit is not done till 11 pm localtime
func HabitNotDoneReminder() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("HabitNotDoneReminder crashed: ", err)
		}
	}()
	utcTime := time.Now().UTC()
	timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Add(time.Minute * 5).Unix() // 5 min ahead of current time
	if timeEpoch > MaxTime {
		timeEpoch -= 86400
	}
	dateEpoch := timeEpoch + Duration_Notify

	users, f := MongoGetManyDoc("users", bson.M{"notifyTime": bson.M{"$gte": timeEpoch, "$lt": dateEpoch}})
	if !f || len(users) == 0 {
		return
	}
	usersId := make([]primitive.ObjectID, 0)
	for _, v := range users {
		uid, ok := v["_id"].(primitive.ObjectID)
		if !ok {
			continue
		}
		usersId = append(usersId, uid)
		SetUserDetails(v)
	}

	habits, f := MongoGetManyDoc("habits", bson.M{"userId": bson.M{"$in": usersId}, "isActive": true})
	if !f || len(habits) == 0 {
		return
	}
	habitlist := make(map[string]primitive.ObjectID)
	habitids := make([]string, 0)
	for _, v := range habits {
		var habitData models.Habit
		hbyte, err := bson.Marshal(v)
		if err != nil {
			continue
		}
		if err := bson.Unmarshal(hbyte, &habitData); err != nil {
			continue
		}

		// check if habit is due today or not
		if habitData.HabitType == "negative" {
			continue
		}
		switch habitData.Repeat.Name {
		case "days":
			day := int(utcTime.Weekday())
			var include bool
			for _, v := range habitData.Repeat.Value {
				if v == day {
					include = true
					break
				}
			}
			if !include {
				continue
			}
		case "dates":
			currentDate := utcTime.Day()
			currentMonth := utcTime.Month()

			var include bool
			for _, v := range habitData.Repeat.Value {
				d := time.Unix(int64(v), 0)
				if d.Day() == currentDate && d.Month() == currentMonth {
					include = true
					break
				}
			}
			if !include {
				continue
			}
		case "todo":
			currentDate := utcTime.Day()
			currentMonth := utcTime.Month()
			userDate := time.Unix(habitData.StartTime, 0)
			if userDate.Day() != currentDate || userDate.Month() != currentMonth {
				continue
			}
		}
		habitlist[habitData.Id.Hex()] = habitData.UserID
		habitids = append(habitids, habitData.Id.Hex())
	}
	t := time.Date(utcTime.Year(), utcTime.Month(), utcTime.Day(), 12, 00, 0, 0, time.UTC).Unix()
	key := fmt.Sprintf("habitCompleted:%d", t)
	_, nf, err := CheckRedisSetMemebers(key, habitids)
	if err != nil {
		return
	}
	if len(nf) == 0 {
		return
	}
	userlist := make(map[primitive.ObjectID]bool, 0)
	for _, v := range nf {
		if _, ok := userlist[habitlist[habitids[v]]]; !ok {
			userlist[habitlist[habitids[v]]] = true
		}
	}
	for k := range userlist {
		userDetails, err := GetUserDetails(k)
		if err != nil {
			continue
		}
		var message UserNotification
		message.Token = userDetails.FCMToken
		message.Notification = &messaging.Notification{
			Title:    fmt.Sprintf("Hey %s, Don't Forget Your Tasks!", userDetails.FirstName),
			Body:     "You have pending tasks for today. Complete them before the day ends to stay on track! 🚀",
			ImageURL: ImageUrl,
		}
		if val, ok := NotifyMap.Load(userDetails.NotifyTime); !ok {
			NotifyMap.Store(userDetails.NotifyTime, []*UserNotification{&message})
		} else {
			val := val.([]*UserNotification)
			val = append(val, &message)
			NotifyMap.Store(userDetails.NotifyTime, val)
		}
	}
}

func InactiveHabits() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("InactiveHabits crashed: ", err)
		}
	}()
	utcTime := time.Now().Add(time.Hour * -24).UTC().Unix()
	filter := bson.M{"endDate": bson.M{"$lt": utcTime}, "isActive": true}
	update := bson.M{"$set": bson.M{"isActive": false}}
	if err := MongoUpdateManyDoc("habits", filter, update); err != nil {
		return
	}
}
