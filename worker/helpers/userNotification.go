package helpers

import (
	"fmt"
	"habit_notify/models"
	"strings"
	"time"
)

var AllUsers map[string]models.User
var lastRun int64

func DoEvery() {
	AllUsers = make(map[string]models.User)
	lastRun = 0
	for t := range time.Tick(5 * time.Minute) {
		t2 := t.UTC()
		hr := t2.Hour()
		min := ((t2.Minute() / 5) * 5) + 5
		redisKey := fmt.Sprintf("habitTime:%d.%d", hr, min)
		ids, err := GetAllRedisSetMemeber(redisKey)
		if err != nil || len(ids) == 0 {
			continue
		}
		tokens := make([]string, 0)
		for _, id := range ids {
			ids := strings.Split(id, ":")
			userDetails, ok := AllUsers[ids[1]]
			if !ok {
				userDetails, err = GetUserDetails(ids[1])
				if err != nil {
					continue
				}
				userDetails.Epoch = time.Now().Unix()
				AllUsers[ids[1]] = userDetails
			}
			if userDetails.FcmToken == "" {
				continue
			}
			tokens = append(tokens, userDetails.FcmToken)
		}
		if len(tokens) > 0 {
			SendNotificationToMany(tokens, "🚀 Your Habit, Your Success! 🌟", "You're just 5 minutes away from greatness! 💪 Stay consistent, and your future self will thank you! 🌱 Let's crush it today! 🔥", "https://res.cloudinary.com/dkznkabup/image/upload/v1736139148/habit-tracker/qxo56br4qdlaiuittpco.webp")
		}
	}
}
