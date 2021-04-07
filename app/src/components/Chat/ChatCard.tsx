/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {ChatStackParamList, RootStackParamList} from '../../navigation-types';
import {READ_CHAT} from '../../graphql/mutation/chat';
import {RootState, useDispatch} from '../../store';
import {readChatAction} from '../../store/chat/actions';
import {Chat, ChatMessageDisplay} from '../../store/chat/types';

import {Item, itemStatusNormalized} from '../../store/item/types';
import {
  Request,
  RequestStatus,
  requestStatusNormalized,
} from '../../store/request/types';

import {Colors, PantoneColor} from '../../utils/Colors';
import {getChatDate, getTime} from '../../utils/getTime';

import {Badge, Button, CustomText} from '../custom-components';
import ProgressiveImage from '../custom-components/ProgressiveImage';
import Feather from 'react-native-vector-icons/Feather';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export type ChatCardType = 'Person' | 'Item';
interface ItemChatCardProps {
  notification?: number;
  latestMsg?: {from: string; msg: string};
  request: Request;
  type: ChatCardType;
  loading: boolean;
}

export const CardLoading = () => (
  <View
    style={[
      styles.chatListCard,
      {backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 30},
    ]}>
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item marginLeft={20}>
          <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item
            marginTop={6}
            width={80}
            height={20}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  </View>
);

const ItemChatCard: React.FC<ItemChatCardProps> = ({
  notification = 0,
  latestMsg = {from: '', msg: ''},
  request,
  type,
  loading = true,
}) => {
  const {navigate} = useNavigation<StackNavigationProp<ChatStackParamList>>();
  const mainNavigation = useNavigation<
    StackNavigationProp<RootStackParamList>
  >();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const mySavedItem = useSelector((state: RootState) => state.user.mySavedItem);
  const [readChat] = useMutation<
    {updateChatToReadAll: Chat},
    {chatRoomid: string}
  >(READ_CHAT);

  const openChatRoom = async () => {
    if (notification > 0) {
      readChatAction(readChat, request, type)(dispatch);
    }
    dispatch({
      type: 'SET_CHAT_WITH',
      payload: type === 'Item' ? request.item.owner : request.requestPerson,
    });
    const chatDisplay: ChatMessageDisplay[] = request.chat.data.map(
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
    dispatch({
      type: 'SET_CURRENT_PROCESS_REQUEST',
      payload: request,
    });
    navigate('ChatRoom', {type});
  };

  const textColor = (requestStatus: RequestStatus): string =>
    requestStatus === 'rejected'
      ? Colors._red_500
      : requestStatus === 'requested'
      ? Colors._blue_400
      : requestStatus === 'accepted'
      ? Colors._indigo_400
      : requestStatus === 'delivered'
      ? Colors._green_400
      : Colors.black;
  if (loading) {
    return <CardLoading />;
  }
  return (
    <TouchableOpacity
      onPress={openChatRoom}
      style={[
        styles.chatListCard,
        request.status === 'requested'
          ? {backgroundColor: Colors._blue_50}
          : request.status === 'accepted'
          ? {backgroundColor: Colors._indigo_100}
          : request.status === 'rejected'
          ? {backgroundColor: Colors._red_100}
          : request.status === 'delivered'
          ? {backgroundColor: Colors._green_50}
          : null,
      ]}>
      {type === 'Person' ? (
        <Button
          onPress={() =>
            mainNavigation.navigate('Profile', {
              visitor: true,
              userInfo: request.requestPerson,
            })
          }
          px={0}
          py={0}>
          <Image
            style={styles.img}
            source={{uri: request.requestPerson.avatar}}
          />
        </Button>
      ) : (
        <View>
          <View style={{position: 'absolute', zIndex: 1, top: -20, left: 0}}>
            <Button
              onPress={() =>
                mainNavigation.navigate('Profile', {
                  visitor: true,
                  userInfo: request.item.owner,
                })
              }
              px={0}
              py={0}>
              <ProgressiveImage
                style={[styles.img, {width: 40, height: 40}]}
                source={{uri: request.item.owner.avatar}}
              />
            </Button>
          </View>
          <Button
            px={0}
            py={0}
            onPress={() =>
              mainNavigation.navigate('Detail', {
                item: request.item,
                wishlist: mySavedItem.some(
                  (item) => item.id === request.item.id,
                ),
              })
            }>
            <ProgressiveImage
              style={styles.img}
              source={{uri: request.item.images[0]}}
            />
          </Button>
        </View>
      )}
      <View style={styles.contentView}>
        {type === 'Person' ? (
          <>
            <CustomText fontWeight={notification > 0 ? 'bold' : 'normal'}>
              {request.requestPerson.info.firstName}{' '}
              {request.requestPerson.info.lastName}
            </CustomText>
            <CustomText color={textColor(request.status)} fontSize={15}>
              สถานะคำขอ : {requestStatusNormalized(request.status)}
            </CustomText>
          </>
        ) : (
          <>
            <CustomText fontWeight="bold">{request.item.name}</CustomText>
            <CustomText fontSize={15}>
              เจ้าของ {request.item.owner.info.firstName}
            </CustomText>
            <CustomText color={textColor(request.status)} fontSize={15}>
              สถานะคำขอ : {requestStatusNormalized(request.status)}
            </CustomText>
          </>
        )}
        <View>
          {latestMsg.from !== '' && latestMsg.msg !== '' ? (
            <CustomText
              fontWeight={notification > 0 ? 'bold' : 'normal'}
              fontSize={14}
              color={
                notification && notification > 0
                  ? Colors.black
                  : 'rgb(75, 85, 99)'
              }>
              {latestMsg.from === currentUser?.id ? 'คุณ : ' : null}
              {latestMsg.msg.length > 20
                ? latestMsg.msg.substr(0, 20) + '...'
                : latestMsg.msg}
              <CustomText fontSize={12}>
                {' '}
                •{' '}
                {getChatDate(
                  new Date(
                    request.chat.data[request.chat.data.length - 1].timestamp,
                  ),
                )}{' '}
                {getTime(
                  new Date(
                    request.chat.data[request.chat.data.length - 1].timestamp,
                  ).getTime(),
                )}
              </CustomText>
            </CustomText>
          ) : null}
        </View>
      </View>
      <View style={styles.notiView}>
        <View
          style={[
            styles.notiBadge,
            notification === 0 ? {backgroundColor: 'transparent'} : null,
          ]}>
          {notification > 0 ? (
            <CustomText textAlign="center" color={Colors.white}>
              {notification}
            </CustomText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface ItemChatCardAbstractProps {
  personRequest: number;
  item: Item;
  onPress?: () => void;
  notification: number;
  loading: boolean;
}

const ItemCardAbstract: React.FC<ItemChatCardAbstractProps> = ({
  personRequest = 0,
  item,
  onPress,
  notification,
  loading = true,
}) => {
  const mainNavigation = useNavigation<
    StackNavigationProp<RootStackParamList>
  >();

  if (loading) {
    return <CardLoading />;
  }
  return (
    <TouchableOpacity onPress={onPress} style={styles.chatListCard}>
      {notification > 0 && <Badge height={20} width={20} />}
      <Button
        px={0}
        py={0}
        onPress={() =>
          mainNavigation.navigate('Detail', {
            item,
            wishlist: false,
          })
        }>
        <Image
          // loadingType="spinner"
          // resizeMode="cover"
          style={styles.img}
          source={{uri: item.images[0]}}
        />
      </Button>
      <View style={styles.contentView}>
        <CustomText fontWeight="bold">{item.name}</CustomText>
        <CustomText fontSize={15}>ประเภท : {item.category}</CustomText>
        <CustomText fontSize={15}>
          สถานะ :{' '}
          {item.status === 'delivered' ? (
            <CustomText fontSize={15} fontWeight="bold">
              ได้ส่งต่อให้ {item.acceptedToPerson?.info.firstName}
            </CustomText>
          ) : (
            itemStatusNormalized(item.status)
          )}
        </CustomText>
      </View>
      <View style={styles.notiView}>
        <View
          style={[
            styles.notiBadge,
            {backgroundColor: PantoneColor.blueDepths},
          ]}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Feather size={14} color={Colors.white} name="users" />
            <CustomText textAlign="center" color={Colors.white}>
              {personRequest}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatListCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    // padding: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOpacity: 0.02,
  },
  notiBadge: {
    backgroundColor: Colors._red_400,
    justifyContent: 'center',
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  notiView: {
    justifyContent: 'center',
  },
  contentView: {
    width: '55%',
  },
  img: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginHorizontal: 10,
  },
});

export {ItemChatCard, ItemCardAbstract};
