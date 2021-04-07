import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NavigationBar from '../components/NavigationBar';

import Home from './Home';
import Search from './Search';

const Tab = createBottomTabNavigator();
export type TabParamList = {
  Home: undefined;
  Search: {catSearch: string | undefined};
};
const TabScreen = () => {
  return (
    <Tab.Navigator tabBar={(props) => <NavigationBar {...props} />}>
      <Tab.Screen name="Index" component={Home} />
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
};

export default TabScreen;
