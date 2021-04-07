/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';

import {View, Image, StyleSheet, Alert} from 'react-native';
import {Button, CustomText, AlertDialog, Input} from '../custom-components';
import {Colors, PantoneColor} from '../../utils/Colors';

import {useNavigation} from '@react-navigation/native';
import {FACEBOOK_LOGIN, USER_LOGIN} from '../../graphql/mutation/user';
import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GET_MY_INFO, MyInfoQueryType} from '../../graphql/query/user';
import {StackNavigationProp} from '@react-navigation/stack';
import {RefreshContext} from '../../../App';
import {RootStackParamList} from '../../navigation-types';
import {useDispatch} from '../../store';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {useMySendRquestsQuery} from '../custom-hooks-graphql/MySendRequests';

const Login = () => {
  const {navigate}: StackNavigationProp<RootStackParamList> = useNavigation();
  const [, refetch] = useMySendRquestsQuery();
  const [username, setUsername] = useState<string>('dummy');
  const [password, setPassword] = useState<string>('1234');
  const [loading, setLoading] = useState<boolean>(false);
  const [login] = useMutation<
    {login: string},
    {username: string; password: string}
  >(USER_LOGIN);
  const [facebookSign] = useMutation<{facebookSign: string}>(FACEBOOK_LOGIN);
  const user = useQuery<MyInfoQueryType>(GET_MY_INFO);
  const dispatch = useDispatch();

  const {savedItem} = useContext(RefreshContext);

  const setDataAndNavigate = async (token: string) => {
    dispatch({type: 'SET_TOKEN', payload: token});
    await AsyncStorage.setItem('userToken', token);
    await savedItem.refresh();
    await refetch();

    // console.log('requerying...');
    const refetchUser = await user.refetch();
    // console.log(refetchUser);
    if (refetchUser.error) {
      throw new Error(refetchUser.error.message);
    }
    if (refetchUser.data) {
      // console.log('complete');
      // console.log(refetchUser.data);
      await AsyncStorage.setItem(
        'userInfo',
        JSON.stringify(refetchUser.data?.getMyInfo),
      );
      dispatch({
        type: 'SET_USER_DATA',
        payload: refetchUser.data?.getMyInfo,
      });
      navigate('Tab', {screen: 'Home'});
    }
  };

  const loginAction = async () => {
    if (username !== '' && password !== '') {
      try {
        setLoading(true);
        const {data, errors} = await login({
          variables: {
            username,
            password,
          },
        });
        if (data && data.login !== 'Login Failed') {
          await setDataAndNavigate(data.login);
        }
        if (errors || data?.login === 'Login Failed') {
          throw new Error('have an error occurs');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert(error.message);
      }
    } else {
      Alert.alert('Please fill');
    }
  };

  const fbLogin = async () => {
    try {
      setLoading(true);
      LoginManager.setLoginBehavior('native_only');
      const res = await LoginManager.logInWithPermissions(['email']);
      if (res.error) {
        throw res.error;
      } else if (res.isCancelled) {
        throw new Error('cancelled');
      } else {
        const token = await AccessToken.getCurrentAccessToken();
        if (token) {
          const {accessToken} = token;
          const {data, errors} = await facebookSign({
            variables: {
              fbAccessToken: accessToken,
            },
          });
          if (errors) {
            throw errors;
          }
          if (data) {
            const jwtToken = data.facebookSign;
            await setDataAndNavigate(jwtToken);
          }
          navigate('Tab', {screen: 'Home'});
        } else {
          setLoading(false);
          throw new Error('fb token is undefined');
        }
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={loading} disabledBtn title="กรุณารอสักครู่...." />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/img/logo.png')}
        />
        <CustomText spacing={10} color={PantoneColor.livingCoral} type="header">
          SHARE
        </CustomText>
      </View>

      <View style={styles.btnView}>
        <Button onPress={fbLogin} rounded px={0} py={10} bg={Colors.facebook}>
          <View style={styles.rowBtntext}>
            <FontAwesome
              style={{paddingHorizontal: 10}}
              color={Colors.white}
              size={35}
              name="facebook"
            />
            <CustomText color={Colors.white}>ล็อกอินผ่าน Facebook</CustomText>
          </View>
        </Button>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
            marginHorizontal: 30,
          }}>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          <View>
            <CustomText textAlign="center">OR</CustomText>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
        <View style={styles.inputContainer}>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            focus
            rounded
            width="100%"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            focus
            rounded
            width="100%"
          />
          <Button
            text="Login"
            bg={PantoneColor.turkishSea}
            color={Colors.white}
            rounded
            my={10}
            onPress={loginAction}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 120,
    marginBottom: 10,
  },
  logo: {height: 200, width: 200, borderRadius: 100},
  inputContainer: {
    marginVertical: 0,
    paddingHorizontal: 50,
    paddingVertical: 25,
  },
  socialLogin: {
    flexDirection: 'row',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  btnView: {
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  rowBtntext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  },
});

export default Login;
