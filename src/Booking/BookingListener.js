import axios from "axios";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Function to get the ID token
const getIdToken = async () => {
  try {
    // Get the user's access token
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const accessToken = userInfo.accessToken;
    console.log(accessToken);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Signin in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available or outdated');
    } else {
      console.error('Some other error happened:', error);
    }
  }
};

export const sendPushNotfication = async (email, date, userList) => {
  await getIdToken();
  // sendPushNotficationWhenAppIsClosed(email, date, userList, idToken);
};

const sendPushNotficationWhenAppIsClosed = async (email, date, userList, idToken) => {
  axios.post(
    "https://us-central1-beyondwash2024-63e69.cloudfunctions.net/pushNotification/",
    {
      userEmail: email,
      date,
    }, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

export const EmployeePushNotification = async (deviceToken, email, date) => {
  axios.post(
    "https://us-central1-beyondwash-c2b4f.cloudfunctions.net/sendAdminPushNotification/api/employeeNotification",
    {
      deviceToken,
      userEmail: email,
      date,
    }
  );
};
