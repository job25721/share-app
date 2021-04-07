import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {combineReducers} from 'redux';
import {useDispatch as _useDispatch} from 'react-redux';
import itemReducers from './item/reducers';
import userReducers from './user/reducers';
import requestReducers from './request/reducers';

import {RequestActionTypes} from './request/types';
import {ItemActionTypes} from './item/types';
import {UserActionTypes} from './user/types';
import {chatReducer} from './chat/reducers';
import {ChatActionTypes} from './chat/types';

const appReducer = combineReducers({
  item: itemReducers,
  user: userReducers,
  request: requestReducers,
  chat: chatReducer,
});

export type RootState = ReturnType<typeof appReducer>;
export type StoreEvent =
  | RequestActionTypes
  | ItemActionTypes
  | UserActionTypes
  | ChatActionTypes
  | {type: 'USER_LOGOUT'};

export const useDispatch = () => {
  const dispatch = _useDispatch();
  return (event: StoreEvent) => {
    dispatch(event);
  };
};

const rootReducer = (state: RootState | undefined, action: any) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default createStore(rootReducer, applyMiddleware(thunk));
