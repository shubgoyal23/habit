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
var NotifyStruct struct {
	Notifications map[int64][]UserNotification
	sync.Mutex
}

type UserNotification struct {
	Notification *messaging.Notification
	Token        string
}

func InitVariables() {
	AllUsers = make(map[primitive.ObjectID]models.User)
}

func DoEveryMinute() {
	for t := range time.Tick(1 * time.Minute) {
		epoch := t.Unix()

		NotifyStruct.Lock()
		docs, ok := NotifyStruct.Notifications[epoch]
		NotifyStruct.Unlock()

		if !ok || len(docs) == 0 {
			continue
		}

		for _, doc := range docs {
			if err := SendHabitNotification(doc); err != nil {
				continue
			}
		}
	}
}

func DoEveryHour() {
	for t := range time.Tick(1 * time.Hour) {
		t = t.Add(1 * time.Hour) // one hour ahead of current time
		utcTime := t.UTC()
		timeEpoch := time.Date(2025, time.January, 1, utcTime.Hour(), utcTime.Minute(), 0, 0, time.UTC).Unix()
		query := bson.M{"startTime": bson.M{"$gte": timeEpoch, "$lt": timeEpoch + 3600}, "notify": true, "isActive": true, "$sort": bson.M{"startTime": 1}}

		docs, f := MongoGetManyDoc("habits", query)
		if !f {
			continue
		}
		if len(docs) > 0 {
			NotifyStruct.Lock()
			NotifyStruct.Notifications = make(map[int64][]UserNotification)
			NotifyStruct.Unlock()
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
			userid := habitData.UserID
			userDetails, err := GetUserDetails(userid)
			if err != nil {
				continue
			}
			userName := userDetails.FirstName
			habitName := habitData.Name
			userPayload := UserNotification{}
			paylod := &messaging.Notification{
				Title:    fmt.Sprintf("🚀 Hey %s, Your Habit, Your Success! 🌟 - %s", userName, habitName),
				Body:     fmt.Sprintf("Hi %s, you're just 5 minutes away from greatness with '%s'! 💪 Stay consistent, and your future self will thank you! 🌱 Let's crush it today! 🔥", userName, habitName),
				ImageURL: "https://res.cloudinary.com/dkznkabup/image/upload/v1736139148/habit-tracker/qxo56br4qdlaiuittpco.webp",
			}
			userPayload.Notification = paylod
			userPayload.Token = *userDetails.FCMToken

			NotifyStruct.Lock()
			if val, ok := NotifyStruct.Notifications[habitData.StartTime]; !ok {
				NotifyStruct.Notifications[habitData.StartTime] = []UserNotification{userPayload}
			} else {
				NotifyStruct.Notifications[habitData.StartTime] = append(val, userPayload)
			}
			NotifyStruct.Unlock()
		}
	}
}
