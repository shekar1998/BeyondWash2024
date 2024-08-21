import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../components/Header';
import CustomButton from '../components/Button/CustomButton';
import {Linking} from 'react-native';

const {width} = Dimensions.get('window');

const Support = () => {
  const handleClick = () => {
    Linking.openURL('whatsapp://send?phone=+919972799549');
  };
  return (
    <View style={styles.container}>
      <Header headerText={'Cusomer Care'} />
      <Image
        style={styles.image}
        source={require('../../assets/images/support.png')}
      />
      <View style={styles.DetailsContainer}>
        <Text style={styles.Heding}>How can we help you ?</Text>
        <Text style={styles.Description}>
          It looks like you are experiencing some texhnical difficulties with
          our app. We are here to help so please get in touch.
        </Text>
        <Text style={styles.MainTextStyle}>Write to us at</Text>
        <View style={styles.TextContainer}>
          <Image
            style={styles.IconImage}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/726/726623.png',
            }}
          />
          <Text style={styles.SubTextStyle}>support@beyondwash.com</Text>
        </View>
        <Text style={styles.MainTextStyle}>Call us at</Text>
        <View style={styles.TextContainer}>
          <Image
            style={styles.IconImage}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/4213/4213179.png',
            }}
          />
          <Text style={styles.SubTextStyle}>+91 8217236803</Text>
        </View>
        <Text style={styles.MainTextStyle}>Whatsapp Support</Text>
        <View style={styles.TextContainer}>
          <CustomButton
            onPress={handleClick}
            title={'Chat'}
            customWidth={width / 3}
          />
        </View>
      </View>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  image: {
    width: width / 1.2,
    height: width / 1.2,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    resizeMode: 'contain',
    top: -70,
  },
  IconImage: {
    width: width * 0.060,
    height: width * 0.060,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  DetailsContainer: {
    top: -80,
    paddingHorizontal: 15,
  },
  MainTextStyle: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  TextStyle: {color: '#000', fontSize: width * 0.035},
  TextContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 25,
    textAlign:'center'
  },
  SubTextStyle: {
    color: '#000',
    fontSize: width * 0.042,
    textAlignVertical: 'center',
    top: 1
  },
  Heding: {
    color: '#000',
    fontSize: width * 0.045,
    fontWeight: '500',
    textAlign: 'center',
  },
  Description: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
