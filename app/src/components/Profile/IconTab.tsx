import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, PantoneColor} from '../../utils/Colors';
import {CustomText} from '../custom-components';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface IconTabPorps {
  name: string;
  text: string;
  active: boolean;
  onPress?: any;
}

const Icontab: React.FC<IconTabPorps> = ({name, text, active, onPress}) => {
  return (
    <View style={styles.main}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.icon,
          active ? {backgroundColor: PantoneColor.veryLivingCoral} : null,
        ]}>
        <FeatherIcon
          style={{color: PantoneColor.livingCoral}}
          name={name}
          size={30}
        />
      </TouchableOpacity>
      <View>
        <CustomText fontSize={16} color={PantoneColor.livingCoral}>
          {text}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: Colors._gray_900,
    padding: 20,
    marginBottom: 5,
  },
  main: {flexDirection: 'column', alignItems: 'center'},
});

export default Icontab;
