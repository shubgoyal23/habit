package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	Id        primitive.ObjectID `bson:"_id"`
	FirstName string             `bson:"firstName"`
	LastName  string             `bson:"lastName"`
	Email     string             `bson:"email"`
	FcmToken  string             `bson:"fcmToken"`
	Epoch     int64              `bson:"epoch"`
	Username  string             `bson:"username"`
	TimeZone  int                `bson:"timeZone"`
	IsActive  bool               `bson:"isActive"`
}

type Habit struct {
	Id          primitive.ObjectID `bson:"_id"`
	UserId      primitive.ObjectID `bson:"userId"`
	Name        string             `bson:"name"`
	Description string             `bson:"description"`
	Duration    int                `bson:"duration"`
	StartTime   int64              `bson:"startTime"`
	EndTime     int64              `bson:"endTime"`
	StartDate   int64              `bson:"startDate"`
	EndDate     int64              `bson:"endDate"`
	Point       int                `bson:"point"`
	Place       string             `bson:"place"`
	Steak       string             `bson:"steak"`
	HabitType   string             `bson:"habitType"`
	How         string             `bson:"how"`
	Ifthen      string             `bson:"ifthen"`
	Notify      bool               `bson:"notify"`
}
