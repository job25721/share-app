import React, {useContext, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Button, CustomText} from '../../../custom-components';
import Feather from 'react-native-vector-icons/Feather';
import {Colors} from '../../../../utils/Colors';

import Tag from './';
import {FormContext} from '../../../../pages/Share';

const FormTag = () => {
  const {state, dispatch} = useContext(FormContext);
  const {tags} = state;
  const [tagInput, setTagInput] = useState('');
  return (
    <>
      <CustomText>แท็ก</CustomText>
      <View style={styles.tagSection}>
        {tags.map((item) => (
          <Tag text={item.text} id={item.id} key={item.id} />
        ))}
        {tags.length < 4 ? (
          // eslint-disable-next-line react-native/no-inline-styles
          <View style={{flexDirection: 'row'}}>
            <Button px={0}>
              <Feather name="plus" color={Colors.black} size={15} />
            </Button>
            <TextInput
              onChangeText={(val) => setTagInput(val)}
              maxLength={10}
              value={tagInput}
              onSubmitEditing={() => {
                if (tagInput !== '') {
                  dispatch({
                    type: 'ADD_TAG',
                    payload: {text: tagInput, id: Date.now()},
                  });
                  setTagInput('');
                }
              }}
              blurOnSubmit={false}
              placeholder="เพิ่มแท็กใหม่"
            />
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tagSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default FormTag;
