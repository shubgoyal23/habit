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

// // return epoch of 1 jan 2025 of time given
// func GetUtcEpoch(epoch int64) int64 {
// 	t := time.Unix(epoch, 0)
// 	netTime := time.Date(2025, time.January, 1, t.UTC().Hour(), t.UTC().Minute(), 0, 0, time.UTC).Unix()
// 	return netTime
// }
