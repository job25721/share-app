/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store, {useDispatch} from './src/store';

import {ApolloError, ApolloProvider} from '@apollo/client';
import client from './src/graphql/client';

import AsyncStorage from '@react-native-async-storage/async-storage';

import 'react-native-gesture-handler';

import {useMySavedItemQuery} from './src/components/custom-hooks-graphql/MySavedItem';

import TabScreen from './src/pages';
import Auth from './src/pages/Auth';
import Share from './src/pages/Share';
import Detail from './src/pages/Detail';
import Profile from './src/pages/Profile';
import ChatIndex, {ChatRoom, PersonModal} from './src/pages/Chat';
import {useChatSubscription} from './src/components/custom-hooks-graphql/ChatSucscription';
import {useMySendRquestsQuery} from './src/components/custom-hooks-graphql/MySendRequests';
import {useMyReceivingRequestsQuery} from './src/components/custom-hooks-graphql/MyReceivingRequests';
import {useRequestSubscription} from './src/components/custom-hooks-graphql/RequestSubscription';
import RequestItem from './src/pages/RequestItem';
import RequestLoading from './src/pages/RequestItem/Loading';

const RootStack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <RootStackScreen />
        </ApolloProvider>
      </Provider>
    </NavigationContainer>
  );
};

interface FeedRefresh {
  refresh: () => Promise<void> | undefined;
  refreshing: boolean;
  itemLoading: boolean | undefined;
  error: ApolloError | undefined;
}
interface SavedItemRefresh {
  refresh: () => Promise<void> | undefined;
  refreshing: boolean;
  itemLoading: boolean;
  error: ApolloError | undefined;
}

type RefreshContext = {
  savedItem: SavedItemRefresh;
};

export const RefreshContext = createContext<RefreshContext>({
  savedItem: {
    refresh: () => undefined,
    refreshing: false,
    itemLoading: false,
    error: undefined,
  },
});

const RootStackScreen: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        // console.log('getting token...');
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // console.log('token found!!!');
          // console.log(token);
          dispatch({type: 'SET_TOKEN', payload: token});
          const user = await AsyncStorage.getItem('userInfo');
          if (user) {
            dispatch({
              type: 'SET_USER_DATA',
              payload: JSON.parse(user),
            });
          }
        }
      } catch (err) {
        // console.log(err);
      }
    };
    getToken();
  }, []);

  useChatSubscription();
  useRequestSubscription();
  useMyReceivingRequestsQuery();
  useMySendRquestsQuery();

  const [
    savedItemQuery,
    refetchSavedItem,
    savedItemRefreshing,
  ] = useMySavedItemQuery();

  return (
    <RefreshContext.Provider
      value={{
        savedItem: {
          refresh: refetchSavedItem,
          refreshing: savedItemRefreshing,
          itemLoading: savedItemQuery.loading,
          error: savedItemQuery.error,
        },
      }}>
      <RootStack.Navigator mode="card">
        <RootStack.Screen
          name="Tab"
          component={TabScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Detail"
          component={Detail}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="RequestItem"
          options={{headerShown: false}}
          component={RequestItem}
        />
        <RootStack.Screen
          name="RequestLoading"
          component={RequestLoading}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Share"
          component={Share}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Chat"
          component={ChatStackScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </RefreshContext.Provider>
  );
};

const ChatStack = createStackNavigator();

const ChatStackScreen: React.FC = () => (
  <ChatStack.Navigator mode="card">
    <ChatStack.Screen
      name="Index"
      component={ChatIndex}
      options={{headerShown: false}}
    />
    <ChatStack.Screen
      name="ChatRoom"
      component={ChatRoom}
      options={{headerShown: false}}
    />
    <ChatStack.Screen
      name="Person"
      component={PersonModal}
      options={{headerShown: false}}
    />
  </ChatStack.Navigator>
);

export default App;
