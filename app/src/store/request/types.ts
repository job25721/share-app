import {Chat, ChatMessageSchema} from '../chat/types';
import {Item} from '../item/types';
import {User} from '../user/types';

const SET_REASON = 'SET_REASON';
const SET_WANTED_RATE = 'SET_WANTED_RATE';
const SET_REQUEST_ITEM_ID = 'SET_REQUEST_ITEM_ID';
const CLEAR_REQUEST_DATA = 'CLEAR_REQUEST_DATA';
export interface OnRequestLoading {
  err: boolean;
  msg: string;
  complete: boolean;
}

export type RequestActionTypes =
  | {type: typeof SET_REASON; payload: string}
  | {type: typeof SET_WANTED_RATE; payload: number}
  | {type: typeof SET_REQUEST_ITEM_ID; payload: string}
  | {type: typeof CLEAR_REQUEST_DATA}
  | {type: 'SET_REQUEST_LOADING'; payload: OnRequestLoading}
  | {type: 'ADD_MY_SEND_REQUETS'; payload: Request}
  | {type: 'SET_MY_RECEIVE_REQUETS'; payload: Request[]}
  | {type: 'SET_MY_SEND_REQUETS'; payload: Request[]}
  | {type: 'ADD_MY_RECEIVE_REQUETS'; payload: Request}
  | {
      type: 'UPDATE_CHAT_TYPE_ITEM';
      payload: {requestId: string; message: ChatMessageSchema};
    }
  | {
      type: 'UPDATE_CHAT_TYPE_PERSON';
      payload: {requestId: string; itemId: string; message: ChatMessageSchema};
    }
  | {type: 'SORT_REQUEST_ARR_TYPE_ITEM'}
  | {
      type: 'SORT_REQUEST_ARR_TYPE_PERSON';
    }
  | {
      type: 'SET_CHAT_TYPE_PERSON';
      payload: {requestId: string; itemId: string; chat: Chat};
    }
  | {
      type: 'SET_CHAT_TYPE_ITEM';
      payload: {requestId: string; chat: Chat};
    }
  | {
      type: 'UPDATE_MY_SEND_REQUEST';
      payload: {requestId: string; update: Request};
    }
  | {
      type: 'UPDATE_RECEIVE_REQUEST';
      payload: {requestId: string; itemId: string; update: Request};
    };

export interface SendingItem {
  item: Item;
  request: Request[];
}
export interface RequestState {
  reason: string;
  wantedRate: number;
  requestItemId: string;
  onRequestLoading: OnRequestLoading;
  mySendRequests: Request[];
  myReceiveRequests: SendingItem[];
  myReceiveRequestPreloaded: Request[];
}

export type RequestStatus = 'requested' | 'accepted' | 'rejected' | 'delivered';

export interface Request {
  id: string;
  itemId: string;
  requestPersonId: string;
  requestToPersonId: string;
  timestamp: string;
  reason: string;
  wantedRate: number;
  status: RequestStatus;
  chat_uid: string;
  chat: Chat;
  item: Item;
  requestPerson: User;
  requestToPerson: User;
}

export const requestStatusNormalized = (
  status: RequestStatus,
): string | null => {
  switch (status) {
    case 'accepted':
      return 'ได้รับการยินยอมจากเจ้าของแล้ว';
    case 'rejected':
      return 'คำขอได้รับการปฏิเสธ';
    case 'requested':
      return 'ส่งคำขอแล้ว';
    case 'delivered':
      return 'ได้ถูกส่งต่อแล้ว';
    default:
      return null;
  }
};
