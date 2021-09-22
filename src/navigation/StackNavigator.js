import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';
import MyDevices from '../screens/MyDevices';
import Measurements from '../screens/Measurements';

import Header from '../components/Header';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, scene, previous }) => (
          <Header navigation={navigation} scene={scene} previous={previous} />
        ),
        headerMode: 'screen',
      }}
    >
      <Stack.Screen name="Home Screen" component={Home} />
    </Stack.Navigator>
  );
};

const MeasurementsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Measurements Screen" component={Measurements} />
    </Stack.Navigator>
  );
};

const MyDevicesStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyDevices Screen" component={MyDevices} />
    </Stack.Navigator>
  );
};

export {
  MainStackNavigator,
  MeasurementsStackNavigator,
  MyDevicesStackNavigator,
};
