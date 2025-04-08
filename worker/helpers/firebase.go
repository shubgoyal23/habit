package helpers

import (
	"context"
	"os"
	"path/filepath"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"go.uber.org/zap"
	"google.golang.org/api/option"
)

var firebaseApp *firebase.App

func InitFirebase() error {
	currentDir, err := os.Getwd()
	if err != nil {
		Logger.Error("Error getting current directory", zap.Error(err))
		return err
	}
	// Construct the path dynamically
	serviceAccountPath := filepath.Join(currentDir, "serviceAccountKey.json")

	opt := option.WithCredentialsFile(serviceAccountPath)
	config := &firebase.Config{ProjectID: "habit-tracker-898ef"}
	app, err := firebase.NewApp(context.Background(), config, opt)
	if err != nil {
		Logger.Error("Failed to initialize app", zap.Error(err))
		return err
	}

	firebaseApp = app
	return nil
}

func SendHabitNotification(user *UserNotification) error {
	client, err := firebaseApp.Messaging(context.Background())
	if err != nil {
		Logger.Error("Failed to get messaging client", zap.Error(err))
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
	if _, err := client.Send(context.Background(), message); err != nil {
		if err.Error() == "Requested entity was not found." {
			RemoveFcmToken(user.Token)
		}
		return err
	}
	return nil
}

// func SendNotification(token string, title string, body string, image string) error {
// 	client, err := firebaseApp.Messaging(context.Background())
// 	if err != nil {
// 		Logger.Error("Failed to get messaging client", zap.Error(err))
// 		return err
// 	}
// 	message := &messaging.Message{
// 		Data: map[string]string{
// 			"score": "850",
// 			"time":  "2:45",
// 		},
// 		Notification: &messaging.Notification{
// 			Title:    title,
// 			Body:     body,
// 			ImageURL: image,
// 		},
// 		Android: &messaging.AndroidConfig{
// 			Notification: &messaging.AndroidNotification{
// 				Icon: "icon.png",
// 			},
// 		},
// 		Token: token,
// 	}
// 	str, err := client.Send(context.Background(), message)
// 	if err != nil {
// 		Logger.Error("Failed to send message", zap.Error(err))
// 		return err
// 	}
// 	Logger.Info("Successfully sent message", zap.String("message_id", str))
// 	return nil
// }

// func SendNotificationToMany(tokens []string, title string, body string, image string) error {
// 	client, err := firebaseApp.Messaging(context.Background())
// 	if err != nil {
// 		Logger.Error("Failed to get messaging client", zap.Error(err))
// 		return err
// 	}
// 	message := &messaging.MulticastMessage{
// 		Notification: &messaging.Notification{
// 			Title:    title,
// 			Body:     body,
// 			ImageURL: image,
// 		},
// 		Tokens: tokens,
// 	}
// 	response, err := client.SendEachForMulticast(context.Background(), message)
// 	if err != nil {
// 		Logger.Error("Failed to send message", zap.Error(err))
// 		return err
// 	}
// 	Logger.Info("Successfully sent message", zap.String("response", fmt.Sprintf("SuccessCount: %d, FailureCount: %d", response.SuccessCount, response.FailureCount)))
// 	return nil
// }

// func SendNotificationBulk(message []*messaging.Message) error {
// 	client, err := firebaseApp.Messaging(context.Background())
// 	if err != nil {
// 		Logger.Error("Failed to get messaging client", zap.Error(err))
// 		return err
// 	}
// 	response, err := client.SendEach(context.Background(), message)
// 	if err != nil {
// 		Logger.Error("Failed to send message", zap.Error(err))
// 		return err
// 	}
// 	Logger.Info("Successfully sent message", zap.String("response", fmt.Sprintf("SuccessCount: %d, FailureCount: %d", response.SuccessCount, response.FailureCount)))
// 	return nil
// }
