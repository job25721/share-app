/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modalbox';
import {Colors, PantoneColor} from '../../utils/Colors';
import {Button, CustomText} from '../custom-components';

interface AcceptAlertProps {
  title: string;
  content?: string;
  open: boolean;
  onConfirm?: () => void;
  onReject?: () => void;
  onClosePress?: () => void;
  confirmText?: string;
  rejectText?: string;
  cancelText?: string;
  hasReject?: boolean;
  disabledBtn?: boolean;
  bindColor?: boolean;
  onClosed: () => void;
}

const AcceptAlert: React.FC<AcceptAlertProps> = ({
  title,
  content,
  onConfirm,
  onReject,
  open,
  confirmText,
  rejectText,
  hasReject,
  disabledBtn,
  bindColor,
  onClosed,
}) => {
  return (
    <Modal
      backdropPressToClose={true}
      swipeToClose={false}
      coverScreen={true}
      onClosed={onClosed}
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
          <CustomText fontSize={16} textAlign="center">
            {content}
          </CustomText>
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
          {/* <Button
            text={cancelText ? cancelText : 'ยกเลิก'}
            onPress={onClosePress}
            color={Colors.white}
            bg={PantoneColor.blueDepths}
          /> */}
          {hasReject ? (
            <Button
              text={rejectText}
              onPress={onReject}
              color={Colors.white}
              bg={
                bindColor === true ? Colors._red_500 : PantoneColor.blueDepths
              }
            />
          ) : null}
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

export default AcceptAlert;
