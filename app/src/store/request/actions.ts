import {MutationFunction} from '@apollo/client';
import {StackNavigationProp} from '@react-navigation/stack';
import {Dispatch} from 'react';
import {StoreEvent} from '..';
import {RootStackParamList} from '../../navigation-types';
import {
  ReuquestMutationReturnType,
  SendRequestDto,
} from '../../graphql/mutation/request';
interface RequestActionPayload {
  wantedRate: number;
  reason: string;
  requestItemId: string;
}

const error = (milliseconds: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({messgae: 'mock error'});
    }, milliseconds);
  });

const promiseDelay = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('complete');
    }, milliseconds);
  });
export const createRequestAction = (
  createRequestMutation: MutationFunction<ReuquestMutationReturnType>,
  navigation: StackNavigationProp<RootStackParamList>,
  payload: RequestActionPayload,
) => async (dispatch: Dispatch<StoreEvent>) => {
  const {requestItemId, reason, wantedRate} = payload;

  if (requestItemId !== '' && reason !== '') {
    const sendRequestData: SendRequestDto = {
      itemId: requestItemId,
      reason,
      wantedRate,
    };
    try {
      navigation.navigate('RequestLoading');
      dispatch({
        type: 'SET_REQUEST_LOADING',
        payload: {
          err: false,
          msg: 'กรุณารอสักครู่ กำลังส่งคำขอ...',
          complete: false,
        },
      });
      const {data, errors} = await createRequestMutation({
        variables: sendRequestData,
      });
      if (errors) {
        throw errors;
      }
      if (data) {
        dispatch({type: 'ADD_MY_SEND_REQUETS', payload: data.createRequest});
        dispatch({
          type: 'SET_REQUEST_LOADING',
          payload: {
            err: false,
            msg: 'ส่งคำขอเรียบร้อย กำลังนำท่านไปที่หน้า Chat',
            complete: true,
          },
        });
        dispatch({type: 'SET_TAB_INDEX', payload: 0});
        await promiseDelay(1500);
        dispatch({type: 'CLEAR_REQUEST_DATA'});
        navigation.navigate('Chat', {screen: 'Index'});
      }
    } catch (err) {
      dispatch({
        type: 'SET_REQUEST_LOADING',
        payload: {
          msg: `มีข้อผิดพลาด\n${err.message}`,
          err: true,
          complete: true,
        },
      });
      // console.log(err);
    }
  } else {
    // console.log('missing value');
  }
};
