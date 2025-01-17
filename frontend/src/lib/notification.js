import { PushNotifications } from "@capacitor/push-notifications";
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import axios from "axios";
import { conf } from "@/conf/conf";
import { Capacitor } from "@capacitor/core";

export const RegisterForNotifications = async () => {
   if (!Capacitor.isNativePlatform()) {
      console.log("Push notifications are only available on native platforms.");
      return;
   }
   try {
      const permissionResult = await PushNotifications.requestPermissions();
      if (permissionResult.receive === "granted") {
         // Register for push notifications
         await PushNotifications.register();

         // Listen for notifications received while app is in foreground
         PushNotifications.addListener(
            "pushNotificationReceived",
            (notification) => {
               console.log("Notification received:", notification);
            }
         );

         // Handle notification actions (e.g., when app is in background or terminated)
         PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (notification) => {
               console.log("Notification action performed:", notification);

               // Custom action, like navigating to a specific page
               const data = notification.notification.data;
               if (data && data.targetPage) {
                  navigateTo(data.targetPage); // Ensure this function is implemented
               }
            }
         );
      } else {
         console.warn("Push notifications permission denied.");
      }
   } catch (error) {
      console.error("Error registering for push notifications:", error);
   }
};

export const sendFcmTokenToServer = async () => {
   try {
      if (!Capacitor.isNativePlatform()) {
         console.log(
            "Push notifications are only available on native platforms."
         );
         return;
      }

      const permissionStatus = await PushNotifications.checkPermissions();
      if (permissionStatus.receive !== "granted") {
         console.warn("Push notification permissions not granted.");
         return;
      }

      // Get the FCM token
      const token = await FirebaseMessaging.getToken();
      console.log("FCM Token:", token.token);

      // Send the token to your backend
      const response = await axios.post(
         `${conf.BACKEND_URL}/api/v1/users/fcm-token`,
         {
            fcmToken: token.token,
         }
      );
      console.log("FCM token sent to server:", response.data);
   } catch (error) {
      console.error("Error sending FCM token to server:", error);
   }
};
