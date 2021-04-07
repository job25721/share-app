import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../../utils/Colors';
import {Button, CustomText} from '../../custom-components';
import FeatherIcon from 'react-native-vector-icons/Feather';

const CameraBtn: React.FC<{onPress: any}> = ({onPress}) => {
  return (
    <Button onPress={onPress} rounded bg={Colors.white} py={20} px={10}>
      <View style={btnStyles.btnFlex}>
        <FeatherIcon name="camera" size={45} />
        <CustomText fontSize={16} fontWeight="bold">
          Open camera
        </CustomText>
      </View>
    </Button>
  );
};

const btnStyles = StyleSheet.create({
  btnFlex: {
    alignItems: 'center',
  },
});

export default CameraBtn;
