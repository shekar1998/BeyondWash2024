import auth from "@react-native-firebase/auth";
import { LoginReducerUpdate } from "../../hooks/Slice";
import PushNotification from "react-native-push-notification";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import PushNotificationIOS from '@react-native-community/push-notification-ios';

let deviceToken = "";

export const SignInOnNoCache = async (dispatch) => {
  try {
    const lastLoginTimestamp = await AsyncStorage.getItem(
      "@last_login_timestamp"
    );
    const parsedData = JSON.parse(lastLoginTimestamp);
    if (lastLoginTimestamp !== null) {
      // If a timestamp exists, compare it with the current time
      const currentTime = new Date().getTime();
      const oneDay = 6 * 30 * 24 * 60 * 60 * 1000;
      if (currentTime - parseInt(parsedData.userDetails.signUpTime) < oneDay) {
        // If less than 5 seconds have passed, don't show the splash screen
        dispatch(LoginReducerUpdate(parsedData));
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "SignInOnNoCache!",
      text2: error,
      visibilityTime: 5000,
      style: {
        backgroundColor: "red",
      },
    });
  }
};

export const login = async (email, password, dispatch) => {
  try {
    const loginData = await auth().signInWithEmailAndPassword(email, password);
    const userDocRef = firestore().collection("Users").doc(loginData.user.uid);
    const userSnapshot = await userDocRef.get();
    const userData = {
      userDetails: {
        displayName: userSnapshot._data.displayName,
        photoURL: userSnapshot._data.photoURL,
        email: loginData.user.email,
        uid: loginData.user.uid,
        deviceToken,
        signUpTime: new Date().getTime().toString(),
        mobileNumber: userSnapshot._data.mobileNumber,
        address: userSnapshot._data.address,
        isAdmin: userSnapshot._data.isAdmin,
        isEmployee: userSnapshot._data.isEmployee,
        assignedBookings: userSnapshot._data.assignedBookings,
        carDetails: userSnapshot._data.carDetails,
      },
      isAuthenticated: true,
    };
    await PushNotification.configure({
      onRegister: async function (token) {
        await firestore().collection("Users").doc(loginData.user.uid).update({
          deviceToken: token.token,
        });
      },
    });

    await AsyncStorage.setItem(
      "@last_login_timestamp",
      JSON.stringify(userData)
    ); // Set the initial timestamp

    dispatch(LoginReducerUpdate(userData));
  } catch (e) {
    Toast.show({
      type: 'ErrorToast',
      props: { TextType: 'Error', ErrorMessage: e.message },
      visibilityTime: 5000,
    });
  }
};

export const updateUserData = async (userUID, updatedData, profile) => {
  try {
    if (profile) {
      const userDocRef = firestore().collection("Users").doc(userUID);
      await userDocRef.update(updatedData);
    } else {
      console.log("userUID", userUID)
      const userDocRef = firestore().collection("Users").doc(userUID);
      await userDocRef.set(updatedData);
    }
  } catch (error) {
    console.log("Profile => ", error);
    Toast.show({
      type: "error",
      text1: "Error updating user profile!",
      text2: `${error}`,
      visibilityTime: 5000,
      style: {
        backgroundColor: "red",
      },
    });
  }
};

export const signup = async (
  email,
  password,
  userName,
  mobileNum,
  dispatch,
  device
) => {
  console.log( email,
    password,
    userName,
    mobileNum,
    dispatch, device)
  try {
    // Create the user with email and password
    const authUser = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    let userData;
    await PushNotification.configure({
          onRegister: async function (token) {
            deviceToken = token;
            userData = {
              userDetails: {
                email: authUser.user.email,
                signUpTime: new Date().getTime().toString(),
                deviceToken: token.token,
                displayName: userName,
                photoURL:
                  "https://cdn3d.iconscout.com/3d/premium/thumb/profile-6335655-5220669.png?f=webp",
                address: "address",
                mobileNumber: mobileNum,
                isAdmin: false,
                isEmployee: true,
                uid: authUser.user.uid,
                assignedBookings: [],
              },
              isAuthenticated: true,
            };
            updateUserData(
              authUser.user.uid,
              {
                deviceToken: token.token,
                displayName: userName,
                photoURL:
                  "https://cdn3d.iconscout.com/3d/premium/thumb/profile-6335655-5220669.png?f=webp",
                address: "",
                mobileNumber: mobileNum,
                isAdmin: false,
                isEmployee: true,
                uid: authUser.user.uid,
                assignedBookings: [],
                email: email,
              },
              false
            );
            await AsyncStorage.setItem(
              "@last_login_timestamp",
              JSON.stringify(userData)
            ); // Set the initial timestamp
    
            dispatch(LoginReducerUpdate(userData));
          },
        });
  } catch (error) {
    console.log("SigmUp => ", error);

    Toast.show({
      type: 'ErrorToast',
      props: { TextType: 'Error', ErrorMessage: error.message },
      visibilityTime: 5000,
    });
  }
};

export const googleSignIn = async (userInfo, phone, dispatch) => {
  const userDocRef = await firestore()
    .collection("Users")
    .doc(userInfo.uid)
    .get();
  let num;
  if (userDocRef.exists) {
    num = userDocRef._data.mobileNumber;
  } else {
    num = phone;
  }
  await PushNotification.configure({
    onRegister: async function (token) {
      deviceToken = token;
      console.log(userInfo);
      updateUserData(
        userInfo.uid,
        {
          deviceToken: token.token,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          address: "",
          mobileNumber: num,
          isAdmin: false,
          isEmployee: false,
          uid: userInfo.uid,
          assignedBookings: [],
          email: userInfo.email,
        },
        false
      );
      let userData = {
        userDetails: {
          signUpTime: new Date().getTime().toString(),
          deviceToken: token.token,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          address: "",
          mobileNumber: num,
          isAdmin: false,
          isEmployee: false,
          uid: userInfo.uid,
          assignedBookings: [],
          email: userInfo.email,
        },
        isAuthenticated: true,
      };

      await AsyncStorage.setItem(
        "@last_login_timestamp",
        JSON.stringify(userData)
      ); // Set the initial timestamp

      dispatch(LoginReducerUpdate(userData));
    },
  });
};