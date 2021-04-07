/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Modal from 'react-native-modalbox';
import {Button, CustomText} from '../custom-components';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../utils/Colors';
interface ShareModalProps {
  isOpen: boolean;
  onClosed?: any;
}

const ShareModal: React.FC<ShareModalProps> = ({isOpen, onClosed}) => {
  return (
    <Modal
      position="bottom"
      style={styles.container}
      isOpen={isOpen}
      onClosed={onClosed}>
      <CustomText type="subheader" textAlign="center">
        แชร์ให้เพื่อนๆของคุณ
      </CustomText>
      <View style={styles.btnView}>
        <Button rounded px={0} py={10} bg={Colors.facebook}>
          <View style={styles.rowBtntext}>
            <FontAwesome
              style={{paddingHorizontal: 10}}
              color={Colors.white}
              size={35}
              name="facebook"
            />
            <CustomText color={Colors.white}>แชร์ไปที่ Facebook</CustomText>
          </View>
        </Button>

        <Button rounded px={0} py={10} bg="#262626">
          <View style={styles.rowBtntext}>
            <FontAwesome
              style={{paddingHorizontal: 10}}
              color={Colors.white}
              size={35}
              name="instagram"
            />
            <CustomText color={Colors.white}>แชร์ไปที่ Instagram</CustomText>
          </View>
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '30%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },
  btnView: {
    marginVertical: 10,
    flex: 1,
    justifyContent: 'center',
  },
  rowBtntext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShareModal;
