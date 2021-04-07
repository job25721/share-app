import {MutationFunction} from '@apollo/client';
import {Dispatch} from 'react';
import store, {StoreEvent} from '..';
import {ChatCardType} from '../../components/Chat/ChatCard';

import {
  SendMessageInput,
  SendMessageReturnType,
} from '../../graphql/mutation/chat';
import {ReuquestMutationReturnType} from '../../graphql/mutation/request';
import {NewDirectMessage} from '../../graphql/subcription/chat';
import {getChatDate, getTime} from '../../utils/getTime';
import {Request} from '../request/types';
import {Chat, SendMessage} from './types';

export interface UpdateRequestPayload {
  requestId: string;
  itemId?: string;
}

export const readChatAction = (
  readChatMutation: MutationFunction<
    {updateChatToReadAll: Chat},
    {chatRoomid: string}
  >,
  request: Request | undefined,
  type: ChatCardType,
) => async (dispatch: Dispatch<StoreEvent>) => {
  try {
    if (request) {
      const readed = await readChatMutation({
        variables: {chatRoomid: request.chat.id},
      });
      if (readed.data) {
        const updatedChat: Chat = readed.data.updateChatToReadAll;
        if (type === 'Person') {
          dispatch({
            type: 'SET_CHAT_TYPE_PERSON',
            payload: {
              requestId: request.id,
              itemId: request.item.id,
              chat: updatedChat,
            },
          });
        } else if (type === 'Item') {
          dispatch({
            type: 'SET_CHAT_TYPE_ITEM',
            payload: {
              requestId: request.id,
              chat: updatedChat,
            },
          });
        }
      }
    } else {
      throw new Error('request to update read chat is undefined');
    }
  } catch (err) {
    //do nothing
    // console.log(err);
  }
};

export const SubscribeMessageAction = (
  newDirect: NewDirectMessage | undefined,
  updateRequestPayload: UpdateRequestPayload,
  currentUserId: string,
) => async (dispatch: Dispatch<StoreEvent>) => {
  if (newDirect && currentUserId === newDirect.to) {
    // console.log('show');
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        pos: 'left',
        msg: newDirect.message.split('\n'),
        time: getTime(new Date(newDirect.timestamp).getTime()),
        date: getChatDate(new Date(newDirect.timestamp)),
      },
    });
    const {itemId, requestId} = updateRequestPayload;
    // console.log(itemId);

    if (!itemId) {
      dispatch({
        type: 'UPDATE_CHAT_TYPE_ITEM',
        payload: {
          requestId,
          message: {
            ...newDirect,
            timestamp: new Date(newDirect.timestamp),
          },
        },
      });
      dispatch({
        type: 'SORT_REQUEST_ARR_TYPE_ITEM',
      });
    } else {
      dispatch({
        type: 'UPDATE_CHAT_TYPE_PERSON',
        payload: {
          requestId,
          itemId,
          message: {
            ...newDirect,
            timestamp: new Date(newDirect.timestamp),
          },
        },
      });
      dispatch({
        type: 'SORT_REQUEST_ARR_TYPE_PERSON',
      });
    }
    dispatch({type: 'SET_NEW_DIRECT', payload: undefined});
  }
};

export const SendMessageAction = (
  sendMessageMutation: MutationFunction<
    SendMessageReturnType,
    SendMessageInput
  >,
  sendMessagePayload: SendMessage,
  updateRequestPayload: UpdateRequestPayload,
) => async (dispatch: Dispatch<StoreEvent>) => {
  const {chatRoomId, messagePayload} = sendMessagePayload;
  const {from, to, message, timestamp} = messagePayload;

  try {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        pos: 'right',
        msg: message.split('\n'),
        time: getTime(new Date(timestamp).getTime()),
        date: getChatDate(new Date(timestamp)),
      },
    });
    const {errors, data} = await sendMessageMutation({
      variables: {
        chatRoomId,
        from,
        to,
        message,
        timestamp,
      },
    });
    if (errors) {
      throw errors;
    }
    if (data) {
      const {itemId, requestId} = updateRequestPayload;
      // console.log('sort');

      if (!itemId) {
        dispatch({
          type: 'UPDATE_CHAT_TYPE_ITEM',
          payload: {
            requestId,
            message: {
              ...messagePayload,
              hasReaded: false,
            },
          },
        });
        dispatch({
          type: 'SORT_REQUEST_ARR_TYPE_ITEM',
        });
      } else {
        dispatch({
          type: 'UPDATE_CHAT_TYPE_PERSON',
          payload: {
            requestId,
            itemId,
            message: {
              ...messagePayload,
              hasReaded: false,
            },
          },
        });
        dispatch({
          type: 'SORT_REQUEST_ARR_TYPE_PERSON',
        });
      }
    }
  } catch (err) {
    // console.log(err);
  }
};

export const acceptRequestAction = (
  acceptRequestMutation: MutationFunction<ReuquestMutationReturnType>,
  type: ChatCardType,
) => async (dispatch: Dispatch<StoreEvent>): Promise<Chat | undefined> => {
  const reqId = store.getState().chat.currentProcessRequest?.id;
  if (reqId) {
    try {
      dispatch({type: 'SET_LOADING_ACTION', payload: true});
      const {data, errors} = await acceptRequestMutation({
        variables: {
          reqId,
        },
      });
      if (errors) {
        throw errors;
      }
      if (data?.acceptRequest) {
        if (type === 'Item') {
          dispatch({
            type: 'UPDATE_MY_SEND_REQUEST',
            payload: {
              requestId: data.acceptRequest.id,
              update: data.acceptRequest,
            },
          });
          dispatch({
            type: 'SORT_REQUEST_ARR_TYPE_ITEM',
          });
        } else {
          dispatch({
            type: 'UPDATE_RECEIVE_REQUEST',
            payload: {
              requestId: data.acceptRequest.id,
              itemId: data.acceptRequest.item.id,
              update: data.acceptRequest,
            },
          });
          dispatch({
            type: 'SORT_REQUEST_ARR_TYPE_PERSON',
          });
        }
        dispatch({
          type: 'SET_CURRENT_PROCESS_REQUEST',
          payload: data.acceptRequest,
        });
        dispatch({type: 'SET_LOADING_ACTION', payload: false});
        return data.acceptRequest.chat;
      }
      return undefined;
    } catch (err) {
      dispatch({type: 'SET_LOADING_ACTION', payload: false});
      // console.log(err);
      return err;
    }
  }
};

export const acceptDeliveredAction = (
  acceptDeliveredMutation: MutationFunction<ReuquestMutationReturnType>,
  type: ChatCardType,
) => async (dispatch: Dispatch<StoreEvent>): Promise<Chat | undefined> => {
  const reqId = store.getState().chat.currentProcessRequest?.id;
  if (reqId) {
    try {
      dispatch({type: 'SET_LOADING_ACTION', payload: true});
      const {data, errors} = await acceptDeliveredMutation({
        variables: {
          reqId,
        },
      });
      if (errors) {
        throw errors;
      }
      if (data?.acceptDelivered) {
        if (type === 'Item') {
          dispatch({
            type: 'UPDATE_MY_SEND_REQUEST',
            payload: {
              requestId: data.acceptDelivered.id,
              update: data.acceptDelivered,
            },
          });
          dispatch({
            type: 'SORT_REQUEST_ARR_TYPE_ITEM',
          });
        } else {
          dispatch({
            type: 'UPDATE_RECEIVE_REQUEST',
            payload: {
              requestId: data.acceptDelivered.id,
              itemId: data.acceptDelivered.item.id,
              update: data.acceptDelivered,
            },
          });
          dispatch({
            type: 'SORT_REQUEST_ARR_TYPE_PERSON',
          });
        }
        dispatch({
          type: 'SET_CURRENT_PROCESS_REQUEST',
          payload: data.acceptDelivered,
        });
        dispatch({type: 'SET_LOADING_ACTION', payload: false});
        return data.acceptDelivered.chat;
      }
      return undefined;
    } catch (err) {
      dispatch({type: 'SET_LOADING_ACTION', payload: false});
      // console.log(err);
      return err;
    }
  }
};

export const rejectRequestAction = (
  rejectRequestMutation: MutationFunction<ReuquestMutationReturnType>,
  type: ChatCardType,
) => async (dispatch: Dispatch<StoreEvent>): Promise<Chat | undefined> => {
  const reqId = store.getState().chat.currentProcessRequest?.id;
  if (reqId) {
    try {
      dispatch({type: 'SET_LOADING_ACTION', payload: true});
      const {data, errors} = await rejectRequestMutation({
        variables: {
          reqId,
        },
      });
      if (errors) {
        throw errors;
      }
      if (data?.rejectRequest) {
        if (type === 'Item') {
          dispatch({
            type: 'UPDATE_MY_SEND_REQUEST',
            payload: {
              requestId: data.rejectRequest.id,
              update: data.rejectRequest,
            },
          });
          dispatch({
            type: 'SORT_REQUEST_ARR_TYPE_ITEM',
          });
        } else {
          dispatch({
            type: 'UPDATE_RECEIVE_REQUEST',
            payload: {
              requestId: data.rejectRequest.id,
              itemId: data.rejectRequest.item.id,
              update: data.rejectRequest,
            },
          });
          dispatch({
            type: 'SORT_REQUEST_ARR_TYPE_PERSON',
          });
        }

        dispatch({
          type: 'SET_CURRENT_PROCESS_REQUEST',
          payload: data.rejectRequest,
        });
        dispatch({type: 'SET_LOADING_ACTION', payload: false});
        return data.rejectRequest.chat;
      }
      return undefined;
    } catch (err) {
      // console.log(err);
      dispatch({type: 'SET_LOADING_ACTION', payload: false});
      return err;
    }
  }
};
