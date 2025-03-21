package helpers

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

var firebaseApp *firebase.App

func InitFirebase() error {
	currentDir, err := os.Getwd()
	if err != nil {
		fmt.Println("Error getting current directory:", err)
		return err
	}

	// Construct the path dynamically
	serviceAccountPath := filepath.Join(currentDir, "serviceAccountKey.json")

	opt := option.WithCredentialsFile(serviceAccountPath)
	config := &firebase.Config{ProjectID: "habit-tracker-898ef"}
	app, err := firebase.NewApp(context.Background(), config, opt)
	if err != nil {
		return fmt.Errorf("error initializing app: %v", err)
	}

	firebaseApp = app
	return nil
}

func SendNotification(token string, title string, body string, image string) error {
	client, err := firebaseApp.Messaging(context.Background())
	if err != nil {
		return err
	}
	message := &messaging.Message{
		Data: map[string]string{
			"score": "850",
			"time":  "2:45",
		},
		Notification: &messaging.Notification{
			Title:    title,
			Body:     body,
			ImageURL: image,
		},
		Android: &messaging.AndroidConfig{
			Notification: &messaging.AndroidNotification{
				Icon: "icon.png",
			},
		},
		Token: token,
	}
	str, err := client.Send(context.Background(), message)
	if err != nil {
		return err
	}
	fmt.Println("Successfully sent message:", str)
	return nil
}

func SendNotificationToMany(tokens []string, title string, body string, image string) error {
	client, err := firebaseApp.Messaging(context.Background())
	if err != nil {
		return err
	}
	message := &messaging.MulticastMessage{
		Notification: &messaging.Notification{
			Title:    title,
			Body:     body,
			ImageURL: image,
		},
		Tokens: tokens,
	}
	response, err := client.SendEachForMulticast(context.Background(), message)
	if err != nil {
		fmt.Println("error", err)
		fmt.Println("response", response)
		return err
	}
	fmt.Println("Successfully sent message:", response)
	return nil
}

func SendHabitNotification(user *UserNotification) error {
	client, err := firebaseApp.Messaging(context.Background())
	if err != nil {
		return err
	}
	message := &messaging.Message{
		Notification: user.Notification,
		Android: &messaging.AndroidConfig{
			Notification: &messaging.AndroidNotification{
				Icon: "icon.png",
			},
		},
		Token: user.Token,
	}
	str, err := client.Send(context.Background(), message)
	if err != nil {
		n := fmt.Sprintf("%s: %s", time.Now().Format("2006-01-02 15:04:05"), err.Error())
		InsertRedisListLPush("habit_notification_Error", []string{n})
		return err
	}
	n := fmt.Sprintf("%s: %s", time.Now().Format("2006-01-02 15:04:05"), str)
	InsertRedisListLPush("habit_notification", []string{n})
	return nil
}

func SendNotificationBulk(message []*messaging.Message) error {
	client, err := firebaseApp.Messaging(context.Background())
	if err != nil {
		return err
	}
	response, err := client.SendEach(context.Background(), message)
	if err != nil {
		n := fmt.Sprintf("%s: %s", time.Now().Format("2006-01-02 15:04:05"), err.Error())
		InsertRedisListLPush("habit_notification_Error", []string{n})
		return err
	}
	fmt.Println("Successfully sent message:", response)
	n := fmt.Sprintf("%s: Batch success %d, failed %d", time.Now().Format("2006-01-02 15:04:05"), response.SuccessCount, response.FailureCount)
	InsertRedisListLPush("habit_notification", []string{n})
	return nil
}
