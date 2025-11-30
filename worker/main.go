package main

import (
	"habit_notify/helpers"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func main() {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT)

	godotenv.Load()
	var Logger *zap.Logger
	if err := helpers.InitRediGo(os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PWD")); err != nil {
		panic(err)
	}

	if logger, err := helpers.InitLogger("habit-worker"); err != nil {
		panic(err)
	} else {
		Logger = logger
	}

	if f := helpers.MongoInit(os.Getenv("MONGODB_URI"), os.Getenv("MONGO_DB")); !f {
		panic(f)
	}

	if err := helpers.InitFirebase(); err != nil {
		panic(err)
	}
	Logger.Info("Starting Server", zap.String("version", "2.0.0"))
	helpers.InitVariables()
	helpers.InitImageHandler()
	go helpers.InitScheduler()

	<-stop
	Logger.Info("Shutting down Server")
}
