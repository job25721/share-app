/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modalbox';
// import Feather from 'react-native-vector-icons/Feather';
import {Colors, PantoneColor} from '../../utils/Colors';
import {CustomText} from './Text';
import {Button} from './CustomButton';

interface AlertDialogProps {
  title: string;
  content?: string;
  onConfirm?: any;
  open: boolean;
  onClosePress?: any;
  confirmText?: string;
  cancelText?: string;
  hasCancel?: boolean;
  disabledBtn?: boolean;
  bindColor?: boolean;
  backdropPressToClose?: boolean;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  content,
  onConfirm,
  open,
  onClosePress,
  confirmText,
  cancelText,
  hasCancel,
  disabledBtn,
  bindColor,
  backdropPressToClose = false,
}) => {
  return (
    <Modal
      backdropPressToClose={backdropPressToClose}
      swipeToClose={false}
      coverScreen={true}
      isOpen={open}
      style={[
        styles.container,
        content ? null : {height: '18%', justifyContent: 'space-evenly'},
      ]}>
      <CustomText fontWeight="bold" textAlign="center" fontSize={25}>
        {title}
      </CustomText>
      {content ? (
        <View style={styles.contentView}>
          <CustomText textAlign="center">{content}</CustomText>
        </View>
      ) : null}
      {disabledBtn ? null : (
        <View style={styles.btnView}>
          <Button
            text={confirmText ? confirmText : 'ตกลง'}
            onPress={onConfirm}
            color={Colors.white}
            bg={bindColor ? Colors._green_600 : PantoneColor.livingCoral}
          />
          {hasCancel === false ? null : (
            <Button
              text={cancelText ? cancelText : 'ยกเลิก'}
              onPress={onClosePress}
              color={Colors.white}
              bg={
                bindColor === true ? Colors._red_500 : PantoneColor.blueDepths
              }
            />
          )}
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '25%',
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  contentView: {justifyContent: 'center', flex: 1},
  btnView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default AlertDialog;
