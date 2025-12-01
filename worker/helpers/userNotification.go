package helpers

import (
	"fmt"
	"habit_notify/models"
	"sync"
	"time"

	"firebase.google.com/go/v4/messaging"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

var AllUsers map[primitive.ObjectID]models.User
var DurationNotify int64 = 1800 // 30 min in sec
var NotifyMap sync.Map
var MaxTime int64 = time.Date(2025, time.January, 1, 23, 59, 59, 59, time.UTC).Unix() //end epoch of 1 jan 2025

func InitVariables() {
	AllUsers = make(map[primitive.ObjectID]models.User)
}

// sends notificaion to users if they exist in NotifyMap at that epoch
func FilerAndSendNotifications() {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("FilerAndSendNotifications crashed", zap.Error(err.(error)))
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

	docs, ok := res.([]*models.UserNotification)
	if !ok {
		Logger.Error("Failed to cast NotifyMap value")
		return
	}

	for _, doc := range docs {
		if err := SendHabitNotification(doc); err != nil {
			Logger.Error("Failed to send notification", zap.Error(err))
		}
	}
	NotifyMap.Delete(timeEpoch)
}

func GetHabitRecords() {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("GetHabitRecords crashed", zap.Error(err.(error)))
		}
	}()
	utcTime := time.Now().UTC().Add(time.Minute * 5) // 5 min ahead of current time
	timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Unix()
	if timeEpoch > MaxTime {
		timeEpoch -= 86400
	}
	// contains all habit ids that are due for this period
	var habitIds []string
	query := bson.M{"startTime": bson.M{"$gte": timeEpoch, "$lt": timeEpoch + DurationNotify}, "isActive": true}
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
		habitIds = append(habitIds, habitData.Id.Hex())
		if habitData.HabitType == "negative" || !habitData.Notify {
			continue
		}
		userid := habitData.UserID
		userDetails, err := GetUserDetails(userid)
		if err != nil {
			continue
		}
		if userDetails.FCMToken == "" {
			continue
		}
		nofity := make([]int64, 0)
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

		userName := userDetails.FirstName
		habitName := habitData.Name
		userPayload := &models.UserNotification{}
		paylod := &messaging.Notification{
			Title:    fmt.Sprintf("🚀 Hey %s! Time for Your Habit: %s", userName, habitName),
			Body:     "Only 5 minutes to go! Stay on track and crush it—your goals are waiting. Let's make it count! 💥",
			ImageURL: ImageUrl,
		}
		userPayload.Notification = paylod
		userPayload.Token = userDetails.FCMToken
		nofity = append(nofity, habitData.StartTime)

		for _, t := range nofity {
			val, ok := NotifyMap.Load(t)
			if !ok {
				NotifyMap.Store(t, []*models.UserNotification{userPayload})
			} else {
				val := val.([]*models.UserNotification)
				val = append(val, userPayload)
				NotifyMap.Store(t, val)
			}
		}
	}

	// add habit to redis set of habit schedule for today
	today := time.Date(utcTime.Year(), utcTime.Month(), utcTime.Day(), 12, 0, 0, 0, time.UTC).Unix()
	AddHabitToRedisSet(today, habitIds...)
}

// this function sends notification to user if habit is not done till 11 pm localtime
func HabitNotDoneReminder() {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("HabitNotDoneReminder crashed", zap.Error(err.(error)))
		}
	}()
	utcTime := time.Now().UTC()
	timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Add(time.Minute * 5).Unix() // 5 min ahead of current time
	if timeEpoch > MaxTime {
		timeEpoch -= 86400
	}
	dateEpoch := timeEpoch + DurationNotify

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
		var message models.UserNotification
		message.Token = userDetails.FCMToken
		message.Notification = &messaging.Notification{
			Title:    fmt.Sprintf("Hey %s, Don't Forget Your Tasks!", userDetails.FirstName),
			Body:     "You have pending tasks for today. Complete them before the day ends to stay on track! 🚀",
			ImageURL: ImageUrl,
		}
		if val, ok := NotifyMap.Load(userDetails.NotifyTime); !ok {
			NotifyMap.Store(userDetails.NotifyTime, []*models.UserNotification{&message})
		} else {
			val := val.([]*models.UserNotification)
			val = append(val, &message)
			NotifyMap.Store(userDetails.NotifyTime, val)
		}
	}
}

func InactiveHabits() {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("InactiveHabits crashed", zap.Error(err.(error)))
		}
	}()
	utcTime := time.Now().Add(time.Hour * -24).UTC().Unix()
	filter := bson.M{"endDate": bson.M{"$lt": utcTime}, "isActive": true}
	ids, f := MongoGetManyDoc("habits", filter)
	if !f {
		return
	}
	for _, v := range ids {
		var habit models.Habit
		byte, err := bson.Marshal(v)
		if err != nil {
			Logger.Error("Failed to marshal habit", zap.Error(err))
			continue
		}
		if err := bson.Unmarshal(byte, &habit); err != nil {
			Logger.Error("Failed to unmarshal habit", zap.Error(err))
			continue
		}
		MongoUpdateOneDoc("users", bson.M{"_id": habit.UserID}, bson.M{"$inc": bson.M{"habitCount": -1}})
	}
	update := bson.M{"$set": bson.M{"isActive": false}}
	if err := MongoUpdateManyDoc("habits", filter, update); err != nil {
		Logger.Error("Failed to update habits", zap.Error(err))
		return
	}
}

// add habit id to redis set
func AddHabitToRedisSet(t int64, habitids ...string) {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("AddHabitToRedisSet crashed", zap.Error(err.(error)))
		}
	}()
	if len(habitids) == 0 {
		return
	}
	key := fmt.Sprintf("habitSchedule:%d", t)
	if _, err := InsertRedisSet(key, habitids...); err != nil {
		Logger.Error("Failed to insert habit to redis set", zap.Error(err))
	}
}

// send email notification to users if habit is not done for 3 days
// func SendEmailNotification() {
// 	defer func() {
// 		if err := recover(); err != nil {
// 			Logger.Error("SendEmailNotification crashed", zap.Error(err.(error)))
// 		}
// 	}()
// 	utcTime := time.Now().Add(time.Hour * -72).UTC().Unix()
// 	filter := bson.M{"endDate": bson.M{"$lt": utcTime}, "isActive": true}
// 	ids, f := MongoGetManyDoc("habits", filter)
// 	if !f {
// 		return
// 	}
// 	for _, v := range ids {
// 		var habit models.Habit
// 		byte, err := bson.Marshal(v)
// 		if err != nil {
// 			Logger.Error("Failed to marshal habit", zap.Error(err))
// 			continue
// 		}
// 		if err := bson.Unmarshal(byte, &habit); err != nil {
// 			Logger.Error("Failed to unmarshal habit", zap.Error(err))
// 			continue
// 		}
// 		MongoUpdateOneDoc("users", bson.M{"_id": habit.UserID}, bson.M{"$inc": bson.M{"habitCount": -1}})
// 	}
// 	update := bson.M{"$set": bson.M{"isActive": false}}
// 	if err := MongoUpdateManyDoc("habits", filter, update); err != nil {
// 		Logger.Error("Failed to update habits", zap.Error(err))
// 		return
// 	}
// }
