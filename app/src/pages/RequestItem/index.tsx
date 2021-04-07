/* eslint-disable react-native/no-inline-styles */
import {useMutation} from '@apollo/client';
import Slider from '@react-native-community/slider';
import {RouteProp, useFocusEffect, useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../navigation-types';
import {
  AlertDialog,
  Button,
  CustomText,
  DismissKeyboard,
  Input,
  ProgressiveImage,
} from '../../components/custom-components';
import {CREATE_REQUEST} from '../../graphql/mutation/request';
import {useDispatch} from '../../store';
import {createRequestAction} from '../../store/request/actions';
import {Colors, PantoneColor} from '../../utils/Colors';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

type RequestScreenRouteProp = RouteProp<RootStackParamList, 'RequestItem'>;
type RequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RequestItem'
>;

type Props = {
  route: RequestScreenRouteProp;
  navigation: RequestScreenNavigationProp;
};

const RequestItem: React.FC<Props> = ({route}) => {
  const {item} = route.params;
  const [isAlert, setAlert] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [createRequest] = useMutation(CREATE_REQUEST);
  const [reason, setReason] = useState<string>('');
  const [wantedRate, setWantedrate] = useState<number>(1);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        console.log('mounted');
        AndroidKeyboardAdjust.setAdjustNothing();
        return () => {
          console.log('unmounted');

          AndroidKeyboardAdjust.setAdjustResize();
        };
      }
    }, []),
  );

  return (
    <>
      <AlertDialog
        open={isAlert}
        onClosePress={() => {
          setAlert(false);
        }}
        onConfirm={() => {
          setAlert(false);
          dispatch({type: 'SET_REQUEST_ITEM_ID', payload: item.id});
          createRequestAction(createRequest, navigation, {
            reason,
            wantedRate,
            requestItemId: item.id,
          })(dispatch);
        }}
        title="ยืนยันคำขอ"
        content="คำขอจะถูกส่งไปหาเจ้าของ และจะทำการสร้างห้องแชทอัตโนมัติ"
      />
      <DismissKeyboard>
        <SafeAreaView style={styles.container}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <ProgressiveImage
              style={{width: 100, height: 100, borderRadius: 20}}
              source={{uri: item.images[0]}}
            />
          </View>
          <CustomText textAlign="center" fontWeight="bold" fontSize={20}>
            ชื่อสิ่งของ : {item.name}
          </CustomText>

          <View style={styles.form}>
            <View style={{flexDirection: 'row'}}>
              <CustomText fontSize={16}>
                ระบุเหตุผลที่ต้องการของชิ้นนี้
              </CustomText>
              <View>
                <CustomText color={Colors._red_500} fontSize={13}>
                  {' '}
                  *จำเป็น
                </CustomText>
              </View>
            </View>
            <Input
              textAlignVertical="top"
              height={250}
              placeholder="กรอกเหตุผล..."
              value={reason}
              onChangeText={(value: string) => setReason(value)}
              multiline
              backgroundColor={Colors.white}
            />
            <View style={{marginTop: 10}}>
              <CustomText>ความต้องการ</CustomText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Slider
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  minimumTrackTintColor={PantoneColor.livingCoral}
                  thumbTintColor={PantoneColor.blueDepths}
                  value={wantedRate}
                  style={{width: '90%'}}
                  onValueChange={(value: number) => {
                    setWantedrate(value);
                  }}
                />
                <CustomText>{wantedRate}</CustomText>
              </View>
            </View>
          </View>
          {reason === '' && (
            <CustomText
              fontSize={Math.floor(Dimensions.get('screen').height * 0.018)}>
              *กรุณากรอกเหตุผล
            </CustomText>
          )}
          <View style={styles.submitBtnView}>
            <Button
              bg={reason !== '' ? PantoneColor.livingCoral : '#cccccc'}
              color={Colors.white}
              width="50%"
              text="ส่งคำขอ"
              onPress={reason !== '' ? () => setAlert(true) : undefined}
            />
            <Button
              bg={PantoneColor.blueDepths}
              color={Colors.white}
              onPress={() => navigation.goBack()}
              width="50%"
              text="ยกเลิก"
            />
          </View>
        </SafeAreaView>
      </DismissKeyboard>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  form: {
    marginVertical: 10,
    flex: 1,
  },
  submitBtnView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
});

export default RequestItem;
