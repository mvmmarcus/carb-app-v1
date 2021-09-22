import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import TabNavigator from '../navigation/TabNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerMode: 'none'}}>
      <Stack.Screen name="Home" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
