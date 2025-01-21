package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// type User struct {
// 	Id        primitive.ObjectID `bson:"_id"`
// 	FirstName string             `bson:"firstName"`
// 	LastName  string             `bson:"lastName"`
// 	Email     string             `bson:"email"`
// 	FcmToken  string             `bson:"fcmToken"`
// 	Epoch     int64              `bson:"epoch"`
// 	Username  string             `bson:"username"`
// 	TimeZone  int                `bson:"timeZone"`
// 	IsActive  bool               `bson:"isActive"`
// }

// User struct
type User struct {
	Id           primitive.ObjectID `bson:"_id" json:"_id"`
	FirstName    string             `json:"firstName" bson:"firstName"`
	LastName     string             `json:"lastName" bson:"lastName"`
	Email        string             `json:"email" bson:"email" validate:"required,email,unique"`
	Username     string             `json:"username" bson:"username" validate:"required,unique"`
	FCMToken     *string            `json:"fcmToken,omitempty" bson:"fcmToken,omitempty"`
	TimeZone     *int               `json:"timeZone,omitempty" bson:"timeZone,omitempty"`
	IsActive     *bool              `json:"isActive,omitempty" bson:"isActive,omitempty"`
	Phone        *string            `json:"phone,omitempty" bson:"phone,omitempty"`
	PhoneDetails *PhoneDetail       `json:"phoneDetails,omitempty" bson:"phoneDetails,omitempty"`
	Epoch        int64              // for local usages
	// RefreshToken *string            `json:"refreshToken,omitempty" bson:"refreshToken,omitempty"`
	// Password     string             `json:"password" bson:"password" validate:"required"`
	// CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
	// UpdatedAt    time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Nested struct for phone details
type PhoneDetail struct {
	DeviceID     *string `json:"deviceId,omitempty" bson:"deviceId,omitempty"`         // device id
	Model        *string `json:"model,omitempty" bson:"model,omitempty"`               // phone model
	OS           *string `json:"os,omitempty" bson:"os,omitempty"`                     // operating system
	OSVersion    *string `json:"osVersion,omitempty" bson:"osVersion,omitempty"`       // os version
	AppVersion   *string `json:"appVersion,omitempty" bson:"appVersion,omitempty"`     // app version
	Manufacturer *string `json:"manufacturer,omitempty" bson:"manufacturer,omitempty"` // phone manufacturer
	MemUsed      *int    `json:"memUsed,omitempty" bson:"memUsed,omitempty"`           // memory used by app
	Lan          *string `json:"lan,omitempty" bson:"lan,omitempty"`                   // phone language
}
type Repeat struct {
	Name  string `bson:"name" json:"name"`   // daily, weekly, monthly, yearly
	Value []int  `bson:"value" json:"value"` // -1 for daily once, time like 1300, etc.
}

// Habit represents the habit schema
type Habit struct {
	Id          primitive.ObjectID `bson:"_id" json:"_id"`
	UserID      primitive.ObjectID `bson:"userId" json:"userId"`                               // User ID who created the habit
	Name        string             `bson:"name" json:"name"`                                   // Habit name
	Description string             `bson:"description,omitempty" json:"description,omitempty"` // Habit description
	Duration    string             `bson:"duration,omitempty" json:"duration,omitempty"`       // Duration of habit
	StartTime   int64              `bson:"startTime" json:"startTime"`                         // Epoch time (start time)
	EndTime     int64              `bson:"endTime" json:"endTime"`                             // Epoch time (end time)
	StartDate   int64              `bson:"startDate" json:"startDate"`                         // Epoch of start date (00:00)
	EndDate     int64              `bson:"endDate" json:"endDate"`                             // Epoch of end date (23:59)
	Repeat      *Repeat            `bson:"repeat" json:"repeat"`                               // Repeat details
	Place       string             `bson:"place,omitempty" json:"place,omitempty"`             // Place of the habit
	How         string             `bson:"how,omitempty" json:"how,omitempty"`                 // How to perform the habit
	IfThen      string             `bson:"ifthen,omitempty" json:"ifthen,omitempty"`           // Conditional instructions
	Point       int                `bson:"point,omitempty" json:"point,omitempty"`             // Points associated with the habit
	Steak       int                `bson:"steak,omitempty" json:"steak,omitempty"`             // Regular days completed
	Notify      bool               `bson:"notify" json:"notify"`                               // Notification setting
	IsActive    bool               `bson:"isActive" json:"isActive"`                           // Whether the habit is active
	HabitType   string             `bson:"habitType" json:"habitType"`                         // Habit type: regular, negative, or oneTime
	CreatedAt   time.Time          `bson:"createdAt,omitempty" json:"createdAt,omitempty"`     // Timestamp when created
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`     // Timestamp when updated
}
