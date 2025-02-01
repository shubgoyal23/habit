package helpers

import (
	"fmt"
	"habit_notify/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var Max_userDetails_Local_storage int64 = 86400 // one day

func GetUserDetails(userid primitive.ObjectID) (user models.User, err error) {
	if user, ok := AllUsers[userid]; ok {
		if (user.Epoch + Max_userDetails_Local_storage) > time.Now().Unix() {
			return user, nil
		}
	}

	filter := bson.M{"_id": userid}
	if f := MongoGetOneDoc("users", filter, &user); !f {
		return user, fmt.Errorf("no user found")
	}
	user.Epoch = time.Now().Unix()
	AllUsers[userid] = user
	return
}

func DoEveryDayTask() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("DoEveryDayTask crashed: ", err)
		}
	}()
	for range time.Tick(24 * time.Hour) {
		ChangeImageDaily()

		utcTime := time.Now().UTC()
		dateEpoch := time.Date(utcTime.Year(), utcTime.Month(), utcTime.Day()-2, 12, 0, 0, 0, time.UTC)
		if err := DelRedisKey(fmt.Sprintf("habitCompleted:%d", dateEpoch.Unix())); err != nil {
			continue
		}
	}

}
