/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Platform, StyleSheet, Text, TextStyle} from 'react-native';

type TextType = 'header' | 'subheader';

interface TextProps {
  fontSize?: number;
  fontWeight?: TextStyle['fontWeight'];
  lineHeight?: TextStyle['lineHeight'];
  spacing?: TextStyle['letterSpacing'];
  textDecorationLine?: TextStyle['textDecorationLine'];
  type?: TextType;
  textAlign?: TextStyle['textAlign'];
  color?: string;
}

export const CustomText: React.FC<TextProps> = ({
  children,
  fontSize = 18,
  fontWeight,
  lineHeight,
  spacing,
  textDecorationLine,
  type,
  textAlign,
  color,
}) => {
  const [size, setSize] = useState(18);
  const [letterSpacing, setSpacing] = useState(0);
  const [lHeight, setLineHeight] = useState(0);
  useEffect(() => {
    fontSize ? setSize(fontSize) : null;
    spacing ? setSpacing(spacing) : null;
    lineHeight ? setLineHeight(lineHeight) : null;
    type === 'header' ? setSize(50) : type === 'subheader' ? setSize(30) : null;
  }, [fontSize, spacing, lineHeight, type]);
  return (
    <Text
      style={[
        styles.text,
        {fontSize: size},
        textDecorationLine
          ? {textDecorationLine}
          : {textDecorationLine: 'none'},
        spacing ? {letterSpacing} : null,
        lineHeight ? {lineHeight: lHeight} : null,
        textAlign ? {textAlign} : null,
        color ? {color} : null,
        fontWeight && fontWeight === 'bold' && Platform.OS === 'android'
          ? {fontFamily: 'SukhumvitSet-Bold'}
          : {fontWeight},
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Sukhumvit Set' : 'SukhumvitSet-Medium',
  },
});
