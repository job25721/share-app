/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import {Colors} from '../../utils/Colors';

interface ButtonProps {
  text?: string;
  bg?: string;
  color?: string;
  fontSize?: number;
  rounded?: boolean;
  onPress?: any;
  width?: number | string;
  mx?: number;
  my?: number;
  px?: number;
  py?: number;
  shadow?: number;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  bg,
  color,
  fontSize,
  rounded,
  onPress,
  width,
  mx,
  my,
  px,
  py,
  children,
  shadow,
}) => {
  const [btnBg, setType] = useState<string>('transparent');
  const [textColor, setColor] = useState<string>(Colors.black);
  const [textSize, setSize] = useState<number>(18);
  const [btnWidth, setBtnWidth] = useState<number | string>(100);
  const [paddingX, setPx] = useState<number>(20);
  const [paddingY, setPy] = useState<number>(Platform.OS === 'ios' ? 5 : 10);
  useEffect(() => {
    bg ? setType(bg) : setType('transparent');
    fontSize ? setSize(fontSize) : null;
    color ? setColor(color) : null;
    width ? setBtnWidth(width) : null;
    px !== undefined && px >= 0 ? setPx(px) : null;
    py !== undefined && py >= 0 ? setPy(py) : null;
  }, [bg, fontSize, color, width, px, py]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        {
          backgroundColor: btnBg,
          paddingHorizontal: paddingX,
          paddingVertical: paddingY,
        },
        rounded ? {borderRadius: 20} : null,
        width ? {width: btnWidth} : null,
        mx ? {marginHorizontal: mx} : null,
        my ? {marginVertical: my} : null,
        shadow ? {shadowOpacity: shadow} : null,
      ]}>
      {children ? (
        children
      ) : (
        <Text
          style={[
            styles.btnText,
            {color: textColor, fontSize: textSize, textAlign: 'center'},
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    shadowColor: Colors.black,
  },
  btnText: {
    fontFamily:
      Platform.OS === 'ios' ? 'SukhumvitSet-Medium' : 'SukhumvitSet-Medium',
  },
});
