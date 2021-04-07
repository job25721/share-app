import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootStackParamList} from '../../navigation-types';
import {ItemCardAbstract} from '../../components/Chat/ChatCard';

import {RootState} from '../../store';

import {CustomText} from '../custom-components';
import {SendingItem} from '../../store/request/types';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {LazyQueryResult, OperationVariables} from '@apollo/client';
import {GetRequestsQueryType} from '../../graphql/query/request';

const SendingItemChat: React.FC<{
  loading: boolean;
  query: LazyQueryResult<GetRequestsQueryType, OperationVariables>;
}> = ({loading, query}) => {
  const {myReceiveRequests} = useSelector((state: RootState) => state.request);
  const [myItemRequest, setMyItemRequest] = useState<SendingItem[]>([]);
  const {userData} = useSelector((state: RootState) => state.user);
  const {data} = query;

  const {navigate} = useNavigation<StackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      setMyItemRequest(myReceiveRequests);
      return () => {
        setMyItemRequest([]);
      };
    }, [myReceiveRequests]),
  );

  if (myItemRequest.length === 0 && data) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={120}
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={80}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{padding: 5}}>
      {myItemRequest.length > 0 ? (
        myItemRequest.map((sending) => (
          <ItemCardAbstract
            loading={loading}
            key={sending.item.id}
            item={sending.item}
            personRequest={sending.request.length}
            notification={sending.request
              .map(
                ({chat}) =>
                  chat.data.filter(
                    ({hasReaded, to}) =>
                      hasReaded === false && to === userData?.id,
                  ).length,
              )
              .reduce((cur, acc) => cur + acc)}
            onPress={() =>
              navigate('Chat', {
                screen: 'Person',
                params: {
                  itemId: sending.item.id,
                  itemName: sending.item.name,
                },
              })
            }
          />
        ))
      ) : (
        <View>
          <CustomText>ไม่มีคนที่ขอรับของคุณตอนนี้</CustomText>
        </View>
      )}
    </View>
  );
};
export default SendingItemChat;
