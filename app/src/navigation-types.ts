import {ParamListBase} from '@react-navigation/routers';
import {ChatCardType} from './components/Chat/ChatCard';
import {TabParamList} from './pages';
import {Item} from './store/item/types';
import {User} from './store/user/types';

export type ChatStackParamList = {
  Index: undefined;
  Person: {itemId: string; itemName: string};
  ChatRoom: {type: ChatCardType};
};

export interface ISubNavigator<T extends ParamListBase, K extends keyof T> {
  screen: K;
  params?: T[K];
}

export type ChatNestedNavigation =
  | ISubNavigator<ChatStackParamList, 'Index'>
  | ISubNavigator<ChatStackParamList, 'Person'>;

export type TabNestedNavigation =
  | ISubNavigator<TabParamList, 'Home'>
  | ISubNavigator<TabParamList, 'Search'>;

export type RootStackParamList = {
  Tab: TabNestedNavigation;
  Auth: undefined;
  Profile: {userInfo: User; visitor: boolean};
  Detail: {item: Item; wishlist: boolean};
  Share: undefined;
  Chat: ChatNestedNavigation;
  RequestItem: {item: Item};
  RequestLoading: undefined;
};
