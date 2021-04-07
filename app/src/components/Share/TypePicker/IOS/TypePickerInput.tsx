import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CustomText} from '../../../custom-components';
import Feather from 'react-native-vector-icons/Feather';

import {FormContext} from '../../../../pages/Share';

const PickerInput: React.FC = () => {
  const {state, dispatch} = useContext(FormContext);
  const {selectedType} = state;
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        dispatch({
          type: 'SET_MODAL',
          payload: true,
        });
      }}>
      <CustomText color={selectedType === undefined ? '#858283' : '#000'}>
        {selectedType === undefined ? 'เลือกประเภท' : selectedType}
      </CustomText>
      <View style={styles.icon}>
        <Feather name="chevron-down" size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 20,
  },
});

export default PickerInput;
