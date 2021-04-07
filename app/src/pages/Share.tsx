import React, {createContext, useReducer, useState} from 'react';
import {SafeAreaView, View, StyleSheet, Platform} from 'react-native';

import {Button, CustomText, AlertDialog} from '../components/custom-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Colors} from '../utils/Colors';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation-types';
import {StackNavigationProp} from '@react-navigation/stack';

import {iOSPicker, Form} from '../components/Share';

import {
  FormReducers,
  formReducers,
  initialState,
} from '../components/Share/reuders';

export const FormContext = createContext<FormReducers>({
  state: initialState,
  dispatch: () => null,
});

type ShareScreenRouteProp = RouteProp<RootStackParamList, 'Share'>;
type ShareScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Share'
>;

type Props = {
  route: ShareScreenRouteProp;
  navigation: ShareScreenNavigationProp;
};

const Share: React.FC<Props> = ({navigation}) => {
  const [state, dispatch] = useReducer(formReducers, initialState);

  const [cancelAlert, setCancelAlert] = useState(false);
  return (
    <FormContext.Provider value={{state, dispatch}}>
      <SafeAreaView style={styles.container}>
        <AlertDialog
          title="Warning"
          content="ข้อมูลที่คุณกรอกจะหายไปทั้งหมด"
          open={cancelAlert}
          onClosePress={() => setCancelAlert(false)}
          cancelText="กรอกต่อ"
          onConfirm={() => {
            setCancelAlert(false);
            navigation.goBack();
          }}
        />
        {Platform.OS === 'ios' ? <iOSPicker.iOSPickerModal /> : null}
        {!state.onSubmitLoading && (
          <View style={styles.backBtnView}>
            <Button
              px={0}
              onPress={() => {
                setCancelAlert(true);
              }}>
              <FeatherIcon color={Colors._red_600} name="x" size={30} />
            </Button>
            <CustomText fontSize={20}>Cancel</CustomText>
          </View>
        )}
        <Form />
      </SafeAreaView>
    </FormContext.Provider>
  );
};

const styles = StyleSheet.create({
  backBtnView: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {backgroundColor: '#f5f5f5', flex: 1},
});

export default Share;
