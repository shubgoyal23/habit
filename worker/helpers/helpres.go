package helpers

import (
	"fmt"
	"habit_notify/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetUserDetails(id string) (user models.User, err error) {
	userid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return user, err
	}
	filter := bson.M{"_id": userid}
	if f := MongoGetOneDoc("users", filter, &user); !f {
		return user, fmt.Errorf("no user found")
	}
	return
}
