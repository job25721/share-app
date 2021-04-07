/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  RefreshControl,
} from 'react-native';

import {Colors, PantoneColor} from '../../utils/Colors';
import {CustomText, Button, Badge} from '../../components/custom-components';

import Feather from 'react-native-vector-icons/Feather';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation-types';
import {StackNavigationProp} from '@react-navigation/stack';
import {ReceivingItemChat, SendingItemChat} from '../../components/Chat';

import {useSelector} from 'react-redux';
import {RootState, useDispatch} from '../../store';
import ChatRoom from './ChatRoom';
import PersonModal from './PersonModal';
import {useMySendRquestsQuery} from '../../components/custom-hooks-graphql/MySendRequests';
import {useMyReceivingRequestsQuery} from '../../components/custom-hooks-graphql/MyReceivingRequests';

type ChatIndexScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatIndexScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  route: ChatIndexScreenRouteProp;
  navigation: ChatIndexScreenNavigationProp;
};

const ChatIndex: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch();
  const activeIndex = useSelector((state: RootState) => state.chat.tabIndex);
  const {mySendRequests} = useSelector((state: RootState) => state.request);
  const {userData} = useSelector((state: RootState) => state.user);
  const {chatNotofication} = useSelector((state: RootState) => state.chat);

  const [myReceiveRequestsNoti, setMyReceiveNoti] = useState<number>(0);
  const [mySendRequestNoti, setMySendNoti] = useState<number>(0);

  const [
    mySendRequestquery,
    refetchMySendRequests,
    mySendRequestRefreshing,
  ] = useMySendRquestsQuery();
  const [
    myReceiveQuery,
    refetchMyReceive,
    myReceiveRefreshing,
  ] = useMyReceivingRequestsQuery();

  useEffect(() => {
    const mySendRequestNotiTab: number = mySendRequests
      .map(
        ({chat}) =>
          chat.data.filter(
            ({hasReaded, to}) => hasReaded === false && to === userData?.id,
          ).length,
      )
      .reduce((cur, acc) => cur + acc, 0);

    setMySendNoti(mySendRequestNotiTab);
    setMyReceiveNoti(chatNotofication - mySendRequestNotiTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mySendRequests, chatNotofication]);

  return (
    <SafeAreaView style={{backgroundColor: Colors._gray_300, flex: 1}}>
      <View style={styles.header}>
        <Button onPress={() => navigation.navigate('Tab', {screen: 'Home'})}>
          <Feather name="arrow-left" size={30} />
        </Button>

        <CustomText color={PantoneColor.livingCoral} fontSize={35}>
          Chat
        </CustomText>
      </View>
      <View style={styles.chatTab}>
        <View>
          {mySendRequestNoti > 0 && <Badge noti={mySendRequestNoti} />}
          <Button
            onPress={async () => {
              dispatch({type: 'SET_TAB_INDEX', payload: 0});
            }}
            bg={activeIndex === 0 ? PantoneColor.livingCoral : 'transparent'}>
            <CustomText color={activeIndex === 0 ? Colors.white : Colors.black}>
              ของที่กำลังขอรับ
            </CustomText>
          </Button>
        </View>
        <View>
          {myReceiveRequestsNoti > 0 && <Badge noti={myReceiveRequestsNoti} />}
          <Button
            onPress={async () => {
              dispatch({type: 'SET_TAB_INDEX', payload: 1});
            }}
            bg={activeIndex === 1 ? PantoneColor.blueDepths : 'transparent'}>
            <CustomText color={activeIndex === 1 ? Colors.white : Colors.black}>
              ของที่กำลังส่งต่อ
            </CustomText>
          </Button>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={
              activeIndex === 0 ? mySendRequestRefreshing : myReceiveRefreshing
            }
            onRefresh={
              activeIndex === 0 ? refetchMySendRequests : refetchMyReceive
            }
          />
        }
        style={styles.container}>
        {activeIndex === 0 ? (
          <ReceivingItemChat
            query={mySendRequestquery}
            loading={mySendRequestquery?.loading || mySendRequestRefreshing}
          />
        ) : activeIndex === 1 ? (
          <SendingItemChat
            query={myReceiveQuery}
            loading={myReceiveQuery?.loading || myReceiveRefreshing}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  header: {flexDirection: 'row', marginTop: 20},
  chatTab: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 10,
  },
});

export {ChatRoom, PersonModal};

export default ChatIndex;
