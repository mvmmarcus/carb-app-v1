import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Sync from '../screens/Sync';
import Registers from '../screens/Registers';
import Menu from '../screens/Menu';
import Profile from '../screens/Profile';
import About from '../screens/About';

import { theme } from '../styles/theme';

const Stack = createNativeStackNavigator();

const MainStackNavigator = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeScreen"
    >
      <Stack.Screen name="HomeScreen" component={Home} />
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
  const { $white } = theme;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MenuScreen"
    >
      <Stack.Screen name="MenuScreen" component={Menu} />
      <Stack.Screen
        name="ProfileScreen"
        options={{
          headerBackTitleVisible: true,
          headerShown: true,
          headerTransparent: true,
          title: 'Editar perfil',
          headerTintColor: $white,
        }}
        component={Profile}
      />
      <Stack.Screen
        name="AboutScreen"
        options={{
          headerBackTitleVisible: true,
          headerShown: true,
          headerTransparent: true,
          title: 'Sobre o Carbs',
          headerTintColor: $white,
        }}
        component={About}
      />
    </Stack.Navigator>
  );
};

export {
  MainStackNavigator,
  RegistersStackNavigator,
  SyncStackNavigator,
  MenuStackNavigator,
};
