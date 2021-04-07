import {ItemState, ItemActionTypes} from './types';
const initialState: ItemState = {
  feedItems: [],
  myReceivingItem: [],
  refreshFeed: false,
  searchResult: [],
};

export default function itemReducers(
  state = initialState,
  action: ItemActionTypes,
): ItemState {
  switch (action.type) {
    case 'SET_FEED_ITEMS':
      return {
        ...state,
        feedItems: action.payload,
      };
    case 'ADD_ITEM':
      return {
        ...state,
        feedItems: [action.payload, ...state.feedItems],
      };
    case 'SET_MY_RECEIVING_ITEM':
      return {
        ...state,
        myReceivingItem: action.payload,
      };
    case 'ADD_MY_RECEIVING_ITEM':
      return {
        ...state,
        myReceivingItem: [action.payload, ...state.myReceivingItem],
      };
    case 'SET_REFRESH_FEED':
      return {
        ...state,
        refreshFeed: action.payload,
      };
    case 'SET_SEARCH_RESULT':
      return {
        ...state,
        searchResult: action.payload,
      };
    default:
      return state;
  }
}
