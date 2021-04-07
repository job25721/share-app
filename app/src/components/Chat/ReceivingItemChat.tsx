/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {ItemChatCard} from './ChatCard';

import {CustomText} from '../custom-components';
import {View} from 'react-native';
import {LazyQueryResult, OperationVariables} from '@apollo/client';
import {GetRequestsQueryType} from '../../graphql/query/request';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Request} from '../../store/request/types';
import {useFocusEffect} from '@react-navigation/core';

const ReceivingItemChat: React.FC<{
  loading: boolean;
  query: LazyQueryResult<GetRequestsQueryType, OperationVariables>;
}> = ({loading, query}) => {
  const {mySendRequests} = useSelector((state: RootState) => state.request);
  const [sendRequests, setSendRequests] = useState<Request[]>([]);
  const currentUser = useSelector((state: RootState) => state.user.userData);

  const {data} = query;

  useFocusEffect(
    React.useCallback(() => {
      setSendRequests(mySendRequests);
      return () => {
        setSendRequests([]);
      };
    }, [mySendRequests]),
  );

  if (sendRequests.length === 0 && data) {
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

  if (!loading && mySendRequests.length === 0 && !data) {
    return (
      <View>
        <CustomText>ไม่มีของที่คุณขอรับ ลองหาของที่คุณอยากได้สิ!</CustomText>
      </View>
    );
  }
  return (
    <View style={{padding: 5}}>
      {sendRequests.map((request) => (
        <ItemChatCard
          loading={loading}
          key={request.id}
          request={request}
          latestMsg={{
            from:
              request.chat.data.length > 0
                ? request.chat.data[request.chat.data.length - 1].from
                : '',
            msg:
              request.chat.data.length > 0
                ? request.chat.data[request.chat.data.length - 1].message
                : '',
          }}
          notification={
            request.chat.data.filter(
              ({hasReaded, to}) =>
                hasReaded === false && currentUser?.id === to,
            ).length
          }
          type="Item"
        />
      ))}
    </View>
  );
};

export default ReceivingItemChat;
