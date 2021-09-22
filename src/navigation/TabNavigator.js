import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFo from 'react-native-vector-icons/Fontisto';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  MainStackNavigator,
  MeasurementsStackNavigator,
  MyDevicesStackNavigator,
} from './StackNavigator';

const Tab = createMaterialBottomTabNavigator();

IconFA.loadFont();
IconFo.loadFont();
IconMC.loadFont();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Home Stack">
      <Tab.Screen
        name="Home Stack"
        component={MainStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <IconMC name="home" size={20} color="#fff" />,
        }}
      />
      <Tab.Screen
        name="Measurements Stack"
        component={MeasurementsStackNavigator}
        options={{
          tabBarLabel: 'Measurements',
          tabBarIcon: () => <IconMC name="diabetes" size={20} color="#fff" />,
        }}
      />

      <Tab.Screen
        name="MyDevices Stack"
        component={MyDevicesStackNavigator}
        options={{
          tabBarLabel: 'Meus dispositivos',
          tabBarIcon: () => <IconMC name="bluetooth" size={20} color="#fff" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
