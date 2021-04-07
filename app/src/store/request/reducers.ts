import {
  preprocessAddNewRequestAbstract,
  preprocessData,
} from '../../utils/requestPreprocess';
import {RequestActionTypes, RequestState} from './types';

const initialState: RequestState = {
  reason: '',
  wantedRate: 1,
  requestItemId: '',

  onRequestLoading: {
    msg: '',
    err: false,
    complete: false,
  },
  mySendRequests: [],
  myReceiveRequests: [],
  myReceiveRequestPreloaded: [],
};

export default function requestReducers(
  state: RequestState = initialState,
  action: RequestActionTypes,
): RequestState {
  switch (action.type) {
    case 'SET_REASON':
      return {
        ...state,
        reason: action.payload,
      };
    case 'SET_WANTED_RATE':
      return {
        ...state,
        wantedRate: action.payload,
      };
    case 'SET_REQUEST_ITEM_ID':
      return {
        ...state,
        requestItemId: action.payload,
      };
    case 'SET_REQUEST_LOADING':
      return {
        ...state,
        onRequestLoading: action.payload,
      };
    case 'SET_MY_SEND_REQUETS':
      return {
        ...state,
        mySendRequests: action.payload,
      };
    case 'ADD_MY_SEND_REQUETS':
      return {
        ...state,
        mySendRequests: [action.payload, ...state.mySendRequests],
      };
    case 'UPDATE_MY_SEND_REQUEST':
      return {
        ...state,
        mySendRequests: state.mySendRequests.map((r) =>
          r.id === action.payload.requestId ? action.payload.update : r,
        ),
      };
    case 'UPDATE_RECEIVE_REQUEST':
      return {
        ...state,
        myReceiveRequests: state.myReceiveRequests.map(({item, request}) => {
          if (item.id === action.payload.itemId) {
            return {
              item,
              request: request.map((req) =>
                req.id === action.payload.requestId
                  ? action.payload.update
                  : req,
              ),
            };
          }
          return {item, request};
        }),
      };

    case 'SET_MY_RECEIVE_REQUETS':
      return {
        ...state,
        myReceiveRequests: preprocessData(action.payload),
        myReceiveRequestPreloaded: action.payload,
      };
    case 'ADD_MY_RECEIVE_REQUETS':
      return {
        ...state,
        myReceiveRequests: preprocessAddNewRequestAbstract(
          state.myReceiveRequests,
          action.payload,
        ),
        myReceiveRequestPreloaded: [
          ...state.myReceiveRequestPreloaded,
          action.payload,
        ],
      };
    case 'UPDATE_CHAT_TYPE_ITEM':
      return {
        ...state,
        mySendRequests: state.mySendRequests.map((request) => {
          if (request.id === action.payload.requestId) {
            return {
              ...request,
              chat: {
                ...request.chat,
                data: [...request.chat.data, action.payload.message],
                lastestUpdate: action.payload.message.timestamp.getTime(),
              },
            };
          }
          return request;
        }),
      };
    case 'SET_CHAT_TYPE_ITEM':
      return {
        ...state,
        mySendRequests: state.mySendRequests.map((request) => {
          if (request.id === action.payload.requestId) {
            return {
              ...request,
              chat: action.payload.chat,
            };
          }
          return request;
        }),
      };
    case 'SORT_REQUEST_ARR_TYPE_ITEM':
      return {
        ...state,
        mySendRequests: state.mySendRequests
          .slice(0)
          .sort((a, b) => b.chat.lastestUpdate - a.chat.lastestUpdate),
      };
    case 'SET_CHAT_TYPE_PERSON':
      return {
        ...state,
        myReceiveRequests: state.myReceiveRequests.map((sendingItem) => {
          if (sendingItem.item.id === action.payload.itemId) {
            return {
              ...sendingItem,
              request: sendingItem.request.map((request) => {
                if (request.id === action.payload.requestId) {
                  return {
                    ...request,
                    chat: action.payload.chat,
                  };
                }
                return request;
              }),
            };
          }
          return sendingItem;
        }),
      };
    case 'UPDATE_CHAT_TYPE_PERSON':
      return {
        ...state,
        myReceiveRequests: state.myReceiveRequests.map((sendingItem) => {
          if (sendingItem.item.id === action.payload.itemId) {
            return {
              ...sendingItem,
              request: sendingItem.request.map((request) => {
                if (request.id === action.payload.requestId) {
                  return {
                    ...request,
                    chat: {
                      ...request.chat,
                      data: [...request.chat.data, action.payload.message],
                      lastestUpdate: action.payload.message.timestamp.getTime(),
                    },
                  };
                }
                return request;
              }),
            };
          }
          return sendingItem;
        }),
      };
    case 'SORT_REQUEST_ARR_TYPE_PERSON':
      return {
        ...state,
        myReceiveRequests: state.myReceiveRequests
          .slice(0)
          .sort((a, b) => {
            const left: number = Math.max(
              ...a.request.map((r) => r.chat.lastestUpdate),
            );
            const right: number = Math.max(
              ...b.request.map((r) => r.chat.lastestUpdate),
            );

            return right - left;
          })
          .map((sending) => {
            return {
              ...sending,
              request: sending.request
                .slice(0)
                .sort((a, b) => b.chat.lastestUpdate - a.chat.lastestUpdate),
            };
          }),
      };
    case 'CLEAR_REQUEST_DATA':
      return initialState;
    default:
      return state;
  }
}
