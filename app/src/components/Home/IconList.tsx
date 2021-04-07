/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, PantoneColor} from '../../utils/Colors';
import {CustomText} from '../custom-components';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const IconList: React.FC<{
  nameIcon: string;
  text: string;
  onPress?: () => void;
}> = ({nameIcon, text, onPress}) => {
  return (
    <TouchableOpacity style={{alignItems: 'center'}} onPress={onPress}>
      <View style={styles.container}>
        <AwesomeIcon color={Colors.white} name={nameIcon} size={35} />
      </View>
      <CustomText fontSize={16} color={PantoneColor.livingCoral}>
        {text}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 50,
    backgroundColor: PantoneColor.livingCoral,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    marginBottom: 10,
  },
});
