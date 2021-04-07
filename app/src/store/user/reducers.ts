import {UserActionTypes, UserState} from './types';

const initialState: UserState = {
  token: null,
  userData: undefined,
  myItem: [],

  mySavedItem: [],
};

export default function userReducers(
  state: UserState = initialState,
  action: UserActionTypes,
): UserState {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
      };
    case 'SET_MY_SAVED_ITEM':
      return {
        ...state,
        mySavedItem: action.payload,
      };
    case 'ADD_MY_SAVED_ITEM':
      return {
        ...state,
        mySavedItem: [action.payload, ...state.mySavedItem],
      };
    case 'REMOVE_SAVED_ITEM':
      return {
        ...state,
        mySavedItem: state.mySavedItem.filter(({id}) => id !== action.payload),
      };
    default:
      return state;
  }
}
