import React from 'react';
import { Text, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import Sync from '../screens/Sync';
import Registers from '../screens/Registers';

const Stack = createStackNavigator();

const Screen = () => {
  return (
    <View>
      <Text>Screen</Text>
    </View>
  );
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen"
    >
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Screen" component={Screen} />
    </Stack.Navigator>
  );
};

const RegistersStackNavigator = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="RegistersScreeen"
    >
      <Stack.Screen name="RegistersScreeen" component={Registers} />
    </Stack.Navigator>
  );
};

const SyncStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SyncScreen"
    >
      <Stack.Screen name="SyncScreen" component={Sync} />
    </Stack.Navigator>
  );
};

export { MainStackNavigator, RegistersStackNavigator, SyncStackNavigator };
