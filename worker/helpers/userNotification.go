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

type UserNotification struct {
	Notification *messaging.Notification
	Token        string
}

func InitVariables() {
	AllUsers = make(map[primitive.ObjectID]models.User)
}

func RunNoficationWorker() {
	go FilerAndSendNotifications()
	go GetHabitRecords()
	go ClearOldRecords()
	for range time.Tick(time.Duration(Duration_Notify) * time.Second) {
		GetHabitRecords()
	}
}

func FilerAndSendNotifications() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("FilerAndSendNotifications crashed: ", err)
		}
	}()
	utcTime := time.Now().UTC()
	timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Unix() + 180 // to send notification 5 minutes ahead of current time
	for range time.Tick(1 * time.Minute) {
		timeEpoch = timeEpoch + 60

		// check if timeEpoch is in map
		res, ok := NotifyMap.Load(timeEpoch)
		if !ok {
			continue
		}

		docs, ok := res.([]*UserNotification)
		if !ok {
			continue
		}

		for _, doc := range docs {
			if err := SendHabitNotification(doc); err != nil {
				continue
			}
		}
		NotifyMap.Delete(timeEpoch)
	}
}

func GetHabitRecords() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("GetHabitRecords crashed: ", err)
		}
	}()
	utcTime := time.Now().UTC().Add(time.Minute * 5) // 5 min ahead of current time
	timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Unix()
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
		switch habitData.HabitType {
		case "regular":
		case "negative":
			continue
		case "todo":
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
			ImageURL: "https://res.cloudinary.com/dkznkabup/image/upload/v1736139148/habit-tracker/qxo56br4qdlaiuittpco.webp",
		}
		userPayload.Notification = paylod
		userPayload.Token = *userDetails.FCMToken
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

	for t := range time.Tick(12 * time.Hour) {
		utcTime := t.UTC().Add(time.Minute * -60).Unix()
		NotifyMap.Range(func(key, value interface{}) bool {
			if key.(int64) < utcTime {
				NotifyMap.Delete(key)
			}
			return true
		})
	}
}
