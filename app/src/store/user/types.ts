import {Item} from '../item/types';

const SET_TOKEN = 'SET_TOKEN';
const SET_USER_DATA = 'SET_USER_DATA';

export interface UserState {
  token: string | null;
  userData: User | undefined;
  myItem: Item[];
  mySavedItem: Item[];
}

export interface User {
  id: string;
  username?: string;
  password?: string;
  email?: string;
  avatar: string;
  info: UserInfo;
  facebookId: string;
}
export interface UserInfo {
  firstName: string;
  lastName: string;
  birthDate?: string;
  age?: number;
}

export interface SetTokenAction {
  type: typeof SET_TOKEN;
  payload: string | null;
}

export interface SetUserDataAction {
  type: typeof SET_USER_DATA;
  payload: User;
}

export type UserActionTypes =
  | SetTokenAction
  | SetUserDataAction
  | {type: 'SET_MY_SAVED_ITEM'; payload: Item[]}
  | {type: 'ADD_MY_SAVED_ITEM'; payload: Item}
  | {type: 'REMOVE_SAVED_ITEM'; payload: string};
