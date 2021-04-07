/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Button, CustomText, ProgressiveImage} from '../custom-components';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import {Colors, PantoneColor} from '../../utils/Colors';
import {useSelector} from 'react-redux';
import {RootState, useDispatch} from '../../store';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation-types';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const HomeHeader: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const {myReceiveRequests, mySendRequests} = useSelector(
    (state: RootState) => state.request,
  );
  const chatNoti = useSelector(
    (state: RootState) => state.chat.chatNotofication,
  );

  useEffect(() => {
    const notification: number = [
      ...mySendRequests.map(
        ({chat}) =>
          chat.data.filter(
            ({hasReaded, to}) => hasReaded === false && to === userData?.id,
          ).length,
      ),
      ...myReceiveRequests.map(({request}) =>
        request
          .map(
            ({chat}) =>
              chat.data.filter(
                ({hasReaded, to}) => hasReaded === false && to === userData?.id,
              ).length,
          )
          .reduce((acc, cur) => acc + cur, 0),
      ),
    ].reduce((acc, cur) => acc + cur, 0);
    dispatch({type: 'SET_CHAT_NOTIFICATION', payload: notification});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myReceiveRequests, mySendRequests]);

  if (userData) {
    return (
      <View style={styles.headerContainer}>
        <Button
          px={0}
          onPress={() =>
            navigation.navigate('Profile', {userInfo: userData, visitor: false})
          }>
          <ProgressiveImage
            style={{
              height: 60,
              width: 60,
              borderRadius: 50,
            }}
            loadingType="spinner"
            source={{uri: userData.avatar}}
          />
        </Button>

        <View style={{paddingLeft: 10, justifyContent: 'center'}}>
          <CustomText fontWeight="700" fontSize={15}>
            {userData.facebookId && (
              <>
                <FontAwesome5Icon
                  size={15}
                  color={Colors.facebook}
                  name="facebook"
                />
                <CustomText> </CustomText>
              </>
            )}
            {userData.info.firstName}
          </CustomText>
          <CustomText fontWeight="700" fontSize={15}>
            {userData.info.lastName}
          </CustomText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            padding: 10,
          }}>
          {/* <Button
            onPress={async () => {
              // console.log(props);
              // navigation.navigate('Notification');
            }}
            px={5}>
            <FeatherIcon name="bell" size={35} />
          </Button> */}
          <Button
            onPress={() => navigation.navigate('Chat', {screen: 'Index'})}
            px={5}>
            {chatNoti > 0 && (
              <View style={styles.chatBadge}>
                <CustomText fontSize={13} fontWeight="700" color={Colors.white}>
                  {chatNoti}
                </CustomText>
              </View>
            )}
            <FeatherIcon name="message-circle" size={35} />
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.headerContainer, {justifyContent: 'flex-end'}]}>
      <Button
        bg={PantoneColor.livingCoral}
        rounded
        px={15}
        py={10}
        onPress={() => {
          navigation.navigate('Auth');
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomText color={Colors.white} spacing={2}>
            Login
          </CustomText>
          <FeatherIcon
            color={Colors.white}
            size={Math.floor(Dimensions.get('screen').width * 0.05)}
            name="log-in"
          />
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  chatBadge: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: Colors._red_500,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeHeader;
