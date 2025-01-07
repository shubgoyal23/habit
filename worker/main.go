package main

import (
	"habit_notify/helpers"
	"os"

	"github.com/joho/godotenv"
)

func main() {
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
	helpers.DoEvery()
}
