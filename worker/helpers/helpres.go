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
