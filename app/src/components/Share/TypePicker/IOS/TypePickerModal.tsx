import React, {useContext} from 'react';
import {CustomText} from '../../../custom-components';
import TypePicker from '../index';
import Modal from 'react-native-modalbox';

import {StyleSheet} from 'react-native';
import {FormContext} from '../../../../pages/Share';

const TypePickerModal: React.FC = () => {
  const {state, dispatch} = useContext(FormContext);
  const {pickerModalOpen} = state;
  return (
    <Modal
      position="bottom"
      style={styles.modalContainer}
      onClosed={() => {
        dispatch({
          type: 'SET_MODAL',
          payload: false,
        });
      }}
      isOpen={pickerModalOpen}>
      <CustomText textAlign="center" fontSize={30}>
        เลือกประเภท
      </CustomText>
      <TypePicker />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 40,
    padding: 10,
    height: '30%',
    justifyContent: 'center',
  },
});

export default TypePickerModal;
