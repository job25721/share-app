import React, {useContext} from 'react';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {CustomText} from '../../../custom-components';
import {PantoneColor} from '../../../..//utils/Colors';

import {FormContext} from '../../../../pages/Share';
import {FormTag} from '../../types';

const Tag: React.FC<FormTag> = ({id, text}) => {
  const {dispatch} = useContext(FormContext);
  return (
    <TouchableOpacity
      onPress={() =>
        Alert.alert('Remove', text, [
          {
            text: 'OK',
            onPress: () => dispatch({type: 'REMOVE_TAG', payload: id}),
          },
          {text: 'Cancel'},
        ])
      }
      style={styles.tag}>
      <CustomText
        fontSize={13}
        fontWeight="bold"
        color={PantoneColor.livingCoral}>
        {text}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tag: {
    backgroundColor: PantoneColor.veryLivingCoral,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 2,
    padding: 10,
    height: 35,
  },
});

export default Tag;
