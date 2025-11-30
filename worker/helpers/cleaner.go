package helpers

import (
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

// remove inactive accounts
func RemoveInactiveAccounts() {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("RemoveInactiveAccounts crashed", zap.Error(err.(error)))
		}
	}()

	if ok := MongoDeleteManyDoc("users", bson.M{"isActive": false}); !ok {
		Logger.Error("Failed to remove inactive accounts")
	}
}

// clear old records from NotifyMap and redis
func ClearOldRecords() {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("ClearOldRecords crashed", zap.Error(err.(error)))
		}
	}()

	t1 := time.Now().UTC().Add(time.Minute * -60).Unix()
	NotifyMap.Range(func(key, value interface{}) bool {
		if key.(int64) < t1 {
			NotifyMap.Delete(key)
		}
		return true
	})
	t2 := time.Now().UTC().AddDate(0, 0, -15)
	keytime := time.Date(t2.Year(), t2.Month(), t2.Day(), 12, 0, 0, 0, time.UTC).Unix()

	// get all habit ids from redis
	habitIds, err := GetAllRedisSetMemeber(fmt.Sprintf("habitSchedule:%d", keytime))
	if err != nil {
		Logger.Error("Failed to get habit ids from redis", zap.Error(err))
		return
	}
	completedHabitIds, err := GetAllRedisSetMemeber(fmt.Sprintf("habitCompleted:%d", keytime))
	if err != nil {
		Logger.Error("Failed to get habit ids from redis", zap.Error(err))
		return
	}
	if len(habitIds) == 0 || len(completedHabitIds) == 0 {
		return
	}
	hids := make([]primitive.ObjectID, 0)
	for _, v := range habitIds {
		id, err := primitive.ObjectIDFromHex(v)
		if err != nil {
			continue
		}
		hids = append(hids, id)
	}
	cids := make([]primitive.ObjectID, 0)
	for _, v := range completedHabitIds {
		id, err := primitive.ObjectIDFromHex(v)
		if err != nil {
			continue
		}
		cids = append(cids, id)
	}
	if ok := MongoAddOneDoc("habits_logs", bson.M{"epoch": keytime, "schedule": bson.A{hids}, "completed": bson.A{cids}}); !ok {
		Logger.Error("Failed to add habits logs")
	}

	// delete old records from redis
	if err := DelRedisKey(fmt.Sprintf("habitCompleted:%d", keytime)); err != nil {
		Logger.Error("Failed to delete old records", zap.Error(err))
	}
	if err := DelRedisKey(fmt.Sprintf("habitSchedule:%d", keytime)); err != nil {
		Logger.Error("Failed to delete old records", zap.Error(err))
	}
}
