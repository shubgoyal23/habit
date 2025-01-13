package main

import (
	"fmt"
	"habit_notify/helpers"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
)

func main() {

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT)

	godotenv.Load()

	if f := helpers.MongoInit(os.Getenv("MONGODB_URI"), os.Getenv("MONGO_DB")); !f {
		panic(f)
	}

	if err := helpers.InitFirebase(); err != nil {
		panic(err)
	}
	if err := helpers.InitRediGo(os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PWD")); err != nil {
		panic(err)
	}
	helpers.InitVariables()
	go helpers.DoEveryHour()
	go helpers.DoEveryMinute()

	<-stop
	fmt.Println("shutting down...")
}
