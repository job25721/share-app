import React from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

export const DismissKeyboard: React.FC = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
