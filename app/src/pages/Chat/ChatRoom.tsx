/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  ScrollView,
  Platform,
  View,
  Image,
} from 'react-native';

import {ChatBubble, Form} from '../../components/Chat';
import {Colors} from '../../utils/Colors';
import {
  CustomText,
  Button,
  AlertDialog,
} from '../../components/custom-components';

import Feather from 'react-native-vector-icons/Feather';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {ChatStackParamList} from '../../navigation-types';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {RootState, useDispatch} from '../../store';
import AcceptAlert from '../../components/Chat/AcceptAlert';
import {
  ACCEPT_DELIVERED,
  ACCEPT_REQUEST,
  REJECT_REQUEST,
} from '../../graphql/mutation/request';
import {useMutation} from '@apollo/client';
import {
  acceptDeliveredAction,
  acceptRequestAction,
  readChatAction,
  rejectRequestAction,
  SendMessageAction,
} from '../../store/chat/actions';

import Modal from 'react-native-modalbox';
import {
  READ_CHAT,
  SendMessageInput,
  SendMessageReturnType,
  SEND_MESSAGE,
} from '../../graphql/mutation/chat';

import {Chat, ChatMessageDisplay} from '../../store/chat/types';
import {getChatDate, getTime} from '../../utils/getTime';

type ChatRoomScreenRouteProp = RouteProp<ChatStackParamList, 'ChatRoom'>;
type ChatRoomScreenNavigationProp = StackNavigationProp<
  ChatStackParamList,
  'ChatRoom'
>;

type Props = {
  route: ChatRoomScreenRouteProp;
  navigation: ChatRoomScreenNavigationProp;
};

const ChatRoom: React.FC<Props> = ({navigation, route}) => {
  const {type} = route.params;

  const {messages, newDirectMessage} = useSelector(
    (state: RootState) => state.chat,
  );

  const scrollRef = useRef<ScrollView>(null);
  const [alertMsg, setAlert] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const {
    chatWith,
    currentProcessRequest,
    loadingAction,
    requestNotify,
  } = useSelector((state: RootState) => state.chat);

  const {item, status, requestPerson, chat, id} = currentProcessRequest;

  const [acceptRequest] = useMutation(ACCEPT_REQUEST);
  const [acceptDelivered] = useMutation(ACCEPT_DELIVERED);
  const [requestRequest] = useMutation(REJECT_REQUEST);
  const [sendMessage] = useMutation<SendMessageReturnType, SendMessageInput>(
    SEND_MESSAGE,
  );
  const [readChat] = useMutation<
    {updateChatToReadAll: Chat},
    {chatRoomid: string}
  >(READ_CHAT);

  const [completeDelivered, setCompleteDelivered] = useState<boolean>(false);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch({type: 'SET_MESSAGE', payload: []});
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (newDirectMessage && newDirectMessage.to === currentUser?.id) {
      readChatAction(readChat, currentProcessRequest, type)(dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDirectMessage]);

  useEffect(() => {
    if (
      requestNotify &&
      requestNotify.request.id === id &&
      (requestNotify.notifyTo === requestPerson.id ||
        requestNotify.notifyTo === item.owner.id)
    ) {
      dispatch({
        type: 'SET_CURRENT_PROCESS_REQUEST',
        payload: requestNotify.request,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestNotify]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardHide);
    };
  }, []);

  const onKeyboardShow = () => {
    scrollRef.current?.scrollToEnd({animated: true});
  };

  const onKeyboardHide = () => {
    scrollRef.current?.scrollToEnd({animated: true});
  };

  const setChat = (chatUdpate: Chat | undefined) => {
    if (chatUdpate) {
      const chatDisplay: ChatMessageDisplay[] = chatUdpate.data.map(
        (chatData) => {
          return {
            pos: currentUser?.id === chatData.from ? 'right' : 'left',
            msg: chatData.message.split('\n'),
            time: getTime(new Date(chatData.timestamp).getTime()),
            date: getChatDate(new Date(chatData.timestamp)),
          };
        },
      );
      dispatch({type: 'SET_MESSAGE', payload: chatDisplay});
    }
  };

  if (chatWith) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={chatStyles.container}>
        <AlertDialog
          title="กระบวนการ SHARE เสร็จสิ้น"
          content={'ห้องแชทได้ถูกปิดแล้ว\nขอบพระคุณที่ใช้บริการของเรา'}
          open={completeDelivered}
          hasCancel={false}
          onConfirm={() => setCompleteDelivered(false)}
        />
        <Modal
          isOpen={loadingAction}
          position="center"
          style={{
            width: '90%',
            height: '18%',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomText fontSize={25} fontWeight="bold">
            กรุณารอสักครู่....
          </CustomText>
        </Modal>
        {currentUser?.id === item.owner.id &&
        status === 'requested' &&
        item.status === 'available' ? (
          <AcceptAlert
            open={alertMsg}
            onConfirm={async () => {
              setAlert(false);
              const updatedChat = await acceptRequestAction(
                acceptRequest,
                type,
              )(dispatch);
              setChat(updatedChat);
            }}
            onReject={async () => {
              setAlert(false);
              const updatedChat = await rejectRequestAction(
                requestRequest,
                type,
              )(dispatch);
              setChat(updatedChat);
            }}
            title="ยืนยันการส่งต่อ"
            bindColor={true}
            content={`ทำการส่งต่อ ${item.name} ให้กับ ${chatWith.info.firstName} `}
            confirmText="ยืนยัน"
            hasReject={true}
            rejectText="ปฏิเสธ"
            onClosed={() => setAlert(false)}
          />
        ) : status === 'accepted' ? (
          <AcceptAlert
            open={alertMsg}
            onClosed={() => setAlert(false)}
            onConfirm={async () => {
              setAlert(false);
              const updatedChat = await acceptDeliveredAction(
                acceptDelivered,
                type,
              )(dispatch);
              setCompleteDelivered(true);
              setChat(updatedChat);
            }}
            title="ยืนยันการรับ"
            content="ท่านได้รับของที่ท่านร้องของเรียบร้อยแล้ว ?"
            confirmText="ได้รับแล้ว"
          />
        ) : (
          <Modal
            isOpen={alertMsg}
            position="center"
            style={{
              width: '90%',
              height: '18%',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CustomText color={Colors._red_500} fontSize={20} fontWeight="bold">
              ของชิ้นนี้คุณได้ส่งต่อให้คนอื่นไปแล้ว
            </CustomText>
          </Modal>
        )}

        <SafeAreaView style={chatStyles.container}>
          <View style={chatStyles.header}>
            <Button px={15} onPress={() => navigation.goBack()}>
              <Feather size={25} name="arrow-left" />
            </Button>
            <Image style={chatStyles.userImg} source={{uri: chatWith.avatar}} />
            <CustomText fontSize={20}>
              {chatWith.info.firstName} {chatWith.info.lastName}
            </CustomText>
          </View>
          <ScrollView
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({animated: true})
            }
            ref={scrollRef}
            style={chatStyles.chatView}>
            {messages.map((data, i) => (
              <ChatBubble chatData={data} key={i.toString()} />
            ))}
          </ScrollView>

          {chat.active ? (
            <Form
              setAlert={setAlert}
              onSendMessage={(message) =>
                SendMessageAction(
                  sendMessage,
                  {
                    chatRoomId: chat.id,
                    messagePayload: {
                      from: currentUser ? currentUser.id : '',
                      to: chatWith.id,
                      message,
                      timestamp: new Date(),
                    },
                  },
                  {
                    requestId: id,
                    itemId: type === 'Item' ? undefined : item.id,
                  },
                )(dispatch)
              }
              hasAcceptBtn={
                (status === 'requested' && currentUser?.id === item.owner.id) ||
                (status === 'accepted' && currentUser?.id === requestPerson.id)
                  ? true
                  : false
              }
            />
          ) : null}
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  return null;
};

const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  chatView: {
    paddingHorizontal: 10,
    paddingTop: 5,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  userImg: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default ChatRoom;
