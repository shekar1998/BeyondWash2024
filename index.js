/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import BookingListener from './src/Booking/BookingListener';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and tokens (android and ios) will be requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});


// Register the background task component
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Received background message:', remoteMessage.data);
  const notification = {
    channelId: 'com.beyondwash.notifications', // Replace with your notification channel ID
    title: remoteMessage.data,
    message: `Done by ${remoteMessage.body.userEmail} on ${remoteMessage.body.date}`,
    // Add any additional data or configuration options
  };

  // Schedule the notification to be sent immediately
  PushNotification.localNotification(notification);
});

if (Platform.OS === 'android') {
  PushNotification.createChannel({
    channelId: 'com.beyondwash.notifications', // Replace 'channel-id' with a unique channel ID of your choice
    channelName: 'Channel Name', // Replace 'Channel Name' with a user-friendly channel name
    channelDescription: 'A description of the notification channel',
    importance: 4, // Set the importance level (1 to 5, with 5 being the highest)
    vibrate: true, // Enable vibration when a notification is displayed
  });
}

AppRegistry.registerHeadlessTask('BookingListener', () => BookingListener);
AppRegistry.registerComponent(appName, () => App);
