import React, {FunctionComponent} from 'react';
import {View, StyleSheet} from 'react-native';

import {Colors} from '../../utils/Colors';
import {CustomText} from './Text';

interface Props {
  noti?: number;
  width?: number;
  height?: number;
}

export const Badge: FunctionComponent<Props> = ({
  noti,
  width = 20,
  height = 20,
}) => (
  <View style={[styles.badge, {width, height}]}>
    {noti && (
      <CustomText
        textAlign="center"
        color={Colors.white}
        fontWeight="700"
        fontSize={14}>
        {noti}
      </CustomText>
    )}
  </View>
);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors._red_500,
    borderRadius: 50,
    position: 'absolute',
    zIndex: 1,
    right: -5,
    top: -10,
    justifyContent: 'center',
  },
});
