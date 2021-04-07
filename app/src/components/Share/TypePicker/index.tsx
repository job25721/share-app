/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Colors} from '../../../utils/Colors';

import {Platform} from 'react-native';
import {FormContext} from '../../../pages/Share';

const TypePicker = () => {
  const {state, dispatch} = useContext(FormContext);
  const {pickerItems, selectedType} = state;
  return (
    <Picker
      selectedValue={selectedType}
      onValueChange={(val) => {
        dispatch({
          type: 'SET_PICKER_TYPE',
          payload: val ? val.toString() : undefined,
        });
      }}
      style={[
        Platform.OS === 'ios'
          ? {height: 150}
          : {fontFamily: 'SukhumvitSet-Medium'},
      ]}
      mode="dropdown">
      <Picker.Item label="เลือกประเภท" value={undefined} color={Colors.grey} />
      {pickerItems.map((item) => (
        <Picker.Item label={item.label} value={item.value} key={item.key} />
      ))}
    </Picker>
  );
};

export default TypePicker;
