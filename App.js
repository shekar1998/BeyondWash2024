import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SideBarNavigation from './navigation/SideBarNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import configureStore from './hooks/Store';
import SplashScreen from './src/Home/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {StyleSheet, Text, View} from 'react-native';
import { Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');


/*
  1. Create the config
*/
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'pink'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 57,
      }}
      text2Style={{
        fontSize: 55,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  ErrorToast: ({text1, props}) => (
    <View style={styles.MainContainer}>
      <View style={styles.ErrorSideContainer}>
        
      </View>
      <View style={styles.TextContainer}>
        <Text style={styles.MainText}>{props.TextType}</Text>
        <Text style={styles.Text}>{props.ErrorMessage}</Text>
      </View>
    </View>
  ),
  SuccessToast: ({text1, props}) => (
    <View style={styles.MainContainer}>
      <View style={styles.SuccessSideContainer} />
      <View style={styles.TextContainer}>
        <Text style={styles.MainText}>{props.TextType}</Text>
        <Text style={styles.Text}>{props.ErrorMessage}</Text>
      </View>
    </View>
  ),
};

/*
  2. Pass the config as prop to the Toast component instance
*/

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const checkSplashScreen = async () => {
      try {
        // Get the timestamp of the last splash screen display
        const lastSplashTimestamp = await AsyncStorage.getItem(
          '@last_splash_timestamp',
        );

        if (lastSplashTimestamp) {
          // If a timestamp exists, compare it with the current time
          const currentTime = new Date().getTime();
          const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

          if (currentTime - parseInt(lastSplashTimestamp) < oneDay) {
            // If less than 5 seconds have passed, don't show the splash screen
            setShowSplash(false);
          } else {
            // If more than 5 seconds have passed, show the splash screen again
            await AsyncStorage.setItem(
              '@last_splash_timestamp',
              currentTime.toString(),
            ); // Update the timestamp
            setShowSplash(true);
          }
        } else {
          // If there's no timestamp, show the splash screen for the first time
          await AsyncStorage.setItem(
            '@last_splash_timestamp',
            new Date().getTime().toString(),
          ); // Set the initial timestamp
          setShowSplash(true);
        }
      } catch (error) {
        console.error('Error reading or writing to AsyncStorage:', error);
      }
    };

    messaging().onMessage(async remoteMessage => {
      console.log('async remoteMessage', remoteMessage);

      PushNotification.localNotification({
        channelId: 'com.beyondwash.notifications', // Replace with your notification channel ID
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
      });
    });

    checkSplashScreen();
  }, []);

  useEffect(() => {
    // After 5 seconds, hide the splash screen
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <SafeAreaProvider>
      <Provider store={configureStore}>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            <SideBarNavigation />
          </NavigationContainer>
        )}
      </Provider>
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    height: '40%',
    width: '90%',
    justifyContent: 'space-between',
    alignContent:'center',
    alignItems:'center',
    alignSelf:'center',
    flexDirection:'row',
    borderRadius: 6,
    overflow:'hidden',
    top:10,
    backgroundColor: '#f5f5f5f6',
  },
  ErrorSideContainer: {
    width:'2%',
    height: '100%',
    backgroundColor:'red',
    borderLeftWidth: 2,
    borderLeftColor: 'red',
  },
  SuccessSideContainer: {
    width:'1.5%',
    height: '100%',
    backgroundColor:'green',
    borderLeftWidth: 1,
    borderLeftColor: 'green',
  },
  TextContainer: {
    width:'98%',
    margin:15,
    justifyContent:'space-evenly',
  },
  MainText: {
    fontSize: height * 0.014,
    fontWeight: '700'
  },
  Text: {
    fontSize: height * 0.014,
    fontWeight: '500'
  },
});

export default App;
