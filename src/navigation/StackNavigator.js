import React from 'react';
import { Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Sync from '../screens/Sync';
import Registers from '../screens/Registers';
import Menu from '../screens/Menu';

const Stack = createNativeStackNavigator();

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

const MenuStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MenuScreen"
    >
      <Stack.Screen name="MenuScreen" component={Menu} />
    </Stack.Navigator>
  );
};

export {
  MainStackNavigator,
  RegistersStackNavigator,
  SyncStackNavigator,
  MenuStackNavigator,
};
