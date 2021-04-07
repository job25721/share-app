/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {Button, Input, CustomText, AlertDialog} from '../../custom-components';

import {Colors, PantoneColor} from '../../../utils/Colors';

import Picker from '../TypePicker/';
import iOSPickerInput from '../TypePicker/IOS/TypePickerInput';
import Modal from 'react-native-modalbox';
import {useMutation} from '@apollo/client';
import {
  AddItemMutationReturnType,
  ADD_NEW_ITEM,
} from '../../../graphql/mutation/item';

import {addItemAction} from '../../../store/item/actions';

import {FormContext} from '../../../pages/Share';
import UploadPhoto from './UploadPhoto';
import TagForm from './Tag/Form';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigation-types';
const iOSPicker = {iOSPickerInput};
const NewItemForm = () => {
  const {state, dispatch} = useContext(FormContext);
  const {itemName, selectedType, description, images, tags} = state;
  const userData = useSelector(
    (reduxState: RootState) => reduxState.user.userData,
  );
  const [addNewItem] = useMutation<AddItemMutationReturnType>(ADD_NEW_ITEM);
  const [alertMsg, setAlert] = useState<boolean>(false);

  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList, 'Share'>
  >();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <Modal
        isOpen={state.onSubmitLoading}
        swipeToClose={false}
        style={{padding: 10, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../../../assets/img/logo.png')}
          style={{width: 150, height: 150, borderRadius: 100}}
        />
        <CustomText fontWeight="bold">โปรดรอสักครู่...</CustomText>
        <CustomText>
          กำลังอัพโหลดรูปภาพ {state.uploadedState}/{state.images.length}
        </CustomText>
      </Modal>
      <AlertDialog
        open={alertMsg}
        onClosePress={() => setAlert(false)}
        onConfirm={async () => {
          setAlert(false);
          await addItemAction(
            {
              name: itemName,
              description,
              category: selectedType,
              images,
              tags: tags.map((tag) => tag.text),
              owner: userData,
            },
            addNewItem,
            navigation,
          )(dispatch);
        }}
        title="ยืนยันข้อมูล"
        content="ข้อมูลถูกต้องครบถ้วนแล้วใช่หรือไม่"
        confirmText="ใช่"
        cancelText="ไม่ใช่"
      />

      <CustomText
        color={PantoneColor.blueDepths}
        textAlign="center"
        fontWeight="bold"
        fontSize={30}>
        เพิ่มของชิ้นใหม่
      </CustomText>
      <ScrollView>
        <UploadPhoto />
        <View style={styles.form}>
          <CustomText fontSize={20} fontWeight="bold">
            รายละเอียดทั่วไป <CustomText color={Colors._red_500}>*</CustomText>
          </CustomText>
          <View style={styles.inputSection}>
            <CustomText>ชื่อสิ่งของ</CustomText>
            <Input
              maxLength={40}
              focus
              value={state.itemName}
              onChangeText={(val: string) =>
                dispatch({type: 'SET_ITEM_NAME', payload: val})
              }
              rounded
              placeholder="สูงสุด 40 ตัวอักษร"
            />

            <CustomText>ประเภท</CustomText>
            {Platform.OS === 'ios' ? <iOSPicker.iOSPickerInput /> : <Picker />}

            <CustomText>รายละเอียด</CustomText>
            <Input
              textAlignVertical="top"
              placeholder="รายละเอียด"
              height={150}
              value={state.description}
              focus
              onChangeText={(val: string) =>
                dispatch({type: 'SET_DESCRIPTION', payload: val})
              }
              multiline
            />
            <TagForm />
          </View>

          <Button
            rounded
            onPress={() =>
              itemName !== '' &&
              description !== '' &&
              selectedType !== null &&
              images.length > 0
                ? setAlert(true)
                : null
            }
            bg={
              itemName !== '' &&
              description !== '' &&
              selectedType !== null &&
              images.length > 0
                ? PantoneColor.livingCoral
                : PantoneColor.veryLivingCoral
            }
            text="แชร์!"
            fontSize={24}
            color={Colors.white}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {paddingHorizontal: 20, marginTop: 10},
  inputSection: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.01,
    elevation: 1,
  },
});

export default NewItemForm;
