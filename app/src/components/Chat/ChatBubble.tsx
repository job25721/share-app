/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Platform, TouchableOpacity} from 'react-native';
import {Colors, PantoneColor} from '../../utils/Colors';

import {CustomText} from '../custom-components';
import {ChatMessageDisplay} from '../../store/chat/types';

interface ChatBubbleProps {
  chatData: ChatMessageDisplay;
}

const ChatBubble: React.FC<ChatBubbleProps> = (props) => {
  const {msg, pos, time, date} = props.chatData;

  return msg ? (
    <TouchableOpacity
      style={[
        bubbleStyles.container,
        pos === 'left' ? bubbleStyles.left : bubbleStyles.right,
      ]}>
      <View
        style={[
          pos === 'left' ? bubbleStyles.msgLeft : bubbleStyles.msgRight,
          bubbleStyles.msgContainer,
        ]}>
        {msg.map((m, i) => (
          <CustomText
            fontWeight="600"
            fontSize={17}
            color={Colors.white}
            key={i}>
            {m}
          </CustomText>
        ))}
      </View>
      <View style={{paddingHorizontal: 5}}>
        <CustomText fontSize={10} textAlign={pos}>
          {date}
        </CustomText>
        <CustomText fontSize={12} textAlign={pos}>
          {time}
        </CustomText>
      </View>
    </TouchableOpacity>
  ) : null;
};

const bubbleStyles = StyleSheet.create({
  container: {
    maxWidth: '75%',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  msgContainer: {
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 5 : 7,
    borderRadius: 20,
  },
  msgLeft: {
    backgroundColor: PantoneColor.livingCoral,
  },
  msgRight: {
    backgroundColor: PantoneColor.blueDepths,
  },
  left: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  right: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
});

export default ChatBubble;
