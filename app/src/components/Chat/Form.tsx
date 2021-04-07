/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import {Button} from '../custom-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Colors} from '../../utils/Colors';
// import {ModalContext} from '../../pages/Chat/ChatRoom';

const ChatForm: React.FC<{
  hasAcceptBtn: boolean;
  onSendMessage: (msg: string) => void;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({hasAcceptBtn, onSendMessage, setAlert}) => {
  const [msg, setMsg] = useState<string>('');
  // const {setAlert} = useContext(ModalContext);

  return (
    <View
      style={[
        chatFromStyles.form,
        Platform.OS === 'android' && {marginBottom: 5},
      ]}>
      <View style={chatFromStyles.chatInputView}>
        <TextInput
          style={chatFromStyles.chatInput}
          focusable
          multiline
          placeholder="Type a message..."
          value={msg}
          onChangeText={setMsg}
        />
      </View>
      <View style={chatFromStyles.btnView}>
        {hasAcceptBtn ? (
          <Button onPress={() => setAlert(true)}>
            <FeatherIcon
              name="check-square"
              color={Colors._indigo_800}
              size={20}
            />
          </Button>
        ) : null}
        <Button
          onPress={() => {
            if (msg !== '') {
              onSendMessage(msg);
              setMsg('');
            }
          }}
          py={12}
          px={10}>
          <FeatherIcon name="send" color={Colors._indigo_800} size={20} />
        </Button>
      </View>
    </View>
  );
};

const chatFromStyles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  chatInputView: {
    justifyContent: 'center',
    flex: 1,
  },
  chatInput: {
    width: '100%',
    backgroundColor: Colors._gray_900,
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingTop: 12,
    borderRadius: 15,
    maxHeight: 200,
  },
  btnView: {
    flexDirection: 'row',
  },
});

export default ChatForm;
