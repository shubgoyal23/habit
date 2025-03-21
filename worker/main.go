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
	fmt.Println("starting...")
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT)

	godotenv.Load()

	helpers.InitLogger()

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
	helpers.InitImageHandler()
	go helpers.RunNoficationWorker()

	<-stop
	fmt.Println("shutting down...")
}
