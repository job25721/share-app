/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';

import {Icontab, ItemCard, ProfileImage} from '../components/Profile/';

import {CustomText, Button} from '../components/custom-components';
import {Colors, PantoneColor} from '../utils/Colors';

import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RouteProp} from '@react-navigation/native';

import {RootStackParamList} from '../navigation-types';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootState, useDispatch} from '../store';
import {useSelector} from 'react-redux';

import {useMyItemQuery} from '../components/custom-hooks-graphql/MyItem';
import {useMyReceivedItemQuery} from '../components/custom-hooks-graphql/MyReceivedItem';
import {LoginManager} from 'react-native-fbsdk';
interface ProfileTabIcons {
  id: number;
  name: string;
  text: string;
}
const profileTabIcons: ProfileTabIcons[] = [
  // {
  //   name: 'user',
  //   text: 'ทั่วไป',
  // },
  {
    id: 1,
    name: 'box',
    text: 'ของของฉัน',
  },
  {
    id: 2,
    name: 'arrow-up-right',
    text: 'รับต่อมา',
  },
  {
    id: 3,
    name: 'bookmark',
    text: 'ที่บันทึกไว้',
  },
];

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

const Profile: React.FC<Props> = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);

  const [myItemQuery, myItemRefetch, myItemRefreshing] = useMyItemQuery();
  const [
    myReceivedItemQuery,
    myReceivedItemRefetch,
    myReceivedItemRefreshing,
  ] = useMyReceivedItemQuery();
  const currentLogin = useSelector((state: RootState) => state.user.userData);
  const mySavedItem = useSelector((state: RootState) => state.user.mySavedItem);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const {visitor, userInfo} = route.params;
  const userData = userInfo;
  const logout = async () => {
    try {
      setLoggingOut(true);
      dispatch({type: 'USER_LOGOUT'});
      LoginManager.logOut();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      navigation.navigate('Tab', {screen: 'Home'});
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  const changeProfileTab = async (tabIndex: number) => {
    try {
      setActive(tabIndex);
      if (tabIndex === 1) {
        await myItemRefetch();
      } else if (tabIndex === 2) {
        await myReceivedItemRefetch();
      }
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  if (loggingOut && !currentLogin) {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <CustomText fontSize={30}>Logging out...</CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Colors.white, paddingVertical: 10}}>
      <View style={styles.header}>
        <Button onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} />
        </Button>
        <Feather name="user" size={35} style={{paddingRight: 10}} />
        <CustomText color={PantoneColor.livingCoral} fontSize={35}>
          Profile
        </CustomText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            right: 20,
          }}>
          {currentLogin && (
            <>
              <CustomText>Logout</CustomText>
              <Button onPress={logout} px={0}>
                <Feather color={Colors._red_500} name="log-out" size={25} />
              </Button>
            </>
          )}
        </View>
      </View>
      <ProfileImage visitor={visitor} user={userData} />
      {!visitor && (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {profileTabIcons.map((item) => (
            <Icontab
              active={active === item.id ? true : false}
              key={item.id.toString()}
              onPress={() => changeProfileTab(item.id)}
              text={item.text}
              name={item.name}
            />
          ))}
        </View>
      )}
      {active === 0 ? (
        <View
          style={{
            alignSelf: 'center',
            marginTop: 30,
            borderRadius: 15,
            flex: 1,
            backgroundColor: Colors._gray_900,
            width: 320,
            alignItems: 'center',
          }}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={
                active === 1
                  ? myItemRefreshing
                  : active === 2
                  ? myReceivedItemRefreshing
                  : false
              }
              onRefresh={
                active === 1
                  ? myItemRefetch
                  : active === 2
                  ? myReceivedItemRefetch
                  : undefined
              }
            />
          }
          style={{paddingHorizontal: 20}}>
          {active === 1 && !visitor
            ? myItemQuery.data &&
              myItemQuery.data.getMyItem.map((item) => (
                <ItemCard
                  loading={myItemQuery.loading || myItemRefreshing}
                  key={item.id}
                  item={item}
                />
              ))
            : active === 2 && !visitor
            ? myReceivedItemQuery.data &&
              myReceivedItemQuery.data.getMyReceivedItem.map((item) => (
                <ItemCard
                  loading={
                    myReceivedItemQuery.loading || myReceivedItemRefreshing
                  }
                  key={item.id}
                  item={item}
                />
              ))
            : active === 3 && !visitor
            ? mySavedItem.map((item) => (
                <ItemCard loading={false} key={item.id} item={item} />
              ))
            : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {flexDirection: 'row', marginTop: 20},
});

export default Profile;
