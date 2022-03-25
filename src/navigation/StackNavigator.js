import React from 'react';
import { Text, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import MyDevices from '../screens/MyDevices';
import Registers from '../screens/Registers';
import Header from '../components/Header';

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

const MyDevicesStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          return <Header {...props} />;
        },
      }}
      initialRouteName="MyDevices Screen"
    >
      <Stack.Screen name="MyDevices Screen" component={MyDevices} />
    </Stack.Navigator>
  );
};

export { MainStackNavigator, RegistersStackNavigator, MyDevicesStackNavigator };
