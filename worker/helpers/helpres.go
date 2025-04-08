package helpers

import (
	"fmt"
	"habit_notify/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

var Max_userDetails_Local_storage int64 = 86400 // one day

func GetUserDetails(userid primitive.ObjectID) (user models.User, err error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("GetUserDetails Crashed: ", r)
		}
	}()
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
func SetUserDetails(userDetails bson.M) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("SetUserDetails Crashed: ", r)
		}
	}()
	byte, err := bson.Marshal(userDetails)
	if err != nil {
		return err
	}
	var user models.User
	if err := bson.Unmarshal(byte, &user); err != nil {
		return err
	}
	user.Epoch = time.Now().Unix()
	AllUsers[user.Id] = user
	return nil
}

func RemoveFcmToken(Token string) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("RemoveFcmToken Crashed: ", r)
		}
	}()
	var user models.User
	if f := MongoGetOneDoc("users", bson.M{"fcmToken": Token}, &user); !f {
		Logger.Error("Failed to get user", zap.String("fcmToken", Token))
		return
	}
	if time.Since(user.UpdatedAt) < time.Hour*48 {
		return
	}
	if err := MongoUpdateOneDoc("users", bson.M{"_id": user.Id}, bson.M{"$set": bson.M{"fcmToken": ""}}); err != nil {
		Logger.Error("Failed to update user", zap.Error(err))
	}
}
