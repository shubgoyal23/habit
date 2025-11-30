package helpers

import (
	"time"

	"go.uber.org/zap"
)

// init scheduler
func InitScheduler() {
	go DoEvery(time.Minute, FilerAndSendNotifications)                                                        // run every minute
	go DoEvery(time.Duration(DurationNotify)*time.Second, GetHabitRecords, ChangeImage, HabitNotDoneReminder) // run every Duration_Notify
	go DoEvery(24*time.Hour, ClearOldRecords)                                                                 // run every 12 hours
	go DoEvery(6*time.Hour, InactiveHabits)                                                                   // run every 12 hours
	go DoEvery(240*time.Hour, RemoveInactiveAccounts)                                                         // run every 240 hours or 10 days

	go GetHabitRecords() // this will runs for first time
}

// run function every after duration
func DoEvery(after time.Duration, f ...func()) {
	defer func() {
		if err := recover(); err != nil {
			Logger.Error("DoEvery crashed", zap.Error(err.(error)))
		}
	}()
	if len(f) == 0 {
		return
	}
	for range time.Tick(after) {
		for _, fn := range f {
			go fn()
		}
	}
}
