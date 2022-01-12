import React, { useContext, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFo from 'react-native-vector-icons/Fontisto';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import BluetoothContext from '../contexts/bluetooth';
import {
  MainStackNavigator,
  MeasurementsStackNavigator,
  MyDevicesStackNavigator,
} from './StackNavigator';
import QuestionsScreen from '../screens/Questions';

const Tab = createMaterialBottomTabNavigator();

const QuestionsStack = createStackNavigator();

IconFA.loadFont();
IconFo.loadFont();
IconMC.loadFont();

const BottomTabNavigator = () => {
  const { setIsAcceptedPermissions, setScanStatus, setBluetoothState } =
    useContext(BluetoothContext);

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) {
          console.log('Permission is OK result: ', result);
          setIsAcceptedPermissions(true);

          BluetoothStateManager.getState()
            .then((bluetoothState) => {
              setBluetoothState(bluetoothState);
            })
            .catch(() => setBluetoothState('PoweredOff'));
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((response) => {
            console.log('response: ', response);
            if (response === 'granted') {
              setIsAcceptedPermissions(true);
              console.log('User accept');

              BluetoothStateManager.getState()
                .then((bluetoothState) => {
                  setBluetoothState(bluetoothState);
                })
                .catch(() => setBluetoothState('PoweredOff'));
            } else {
              setIsAcceptedPermissions(false);
              console.log('User refuse');
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    const bluetoothStateSubscription = BluetoothStateManager.onStateChange(
      (bluetoothState) => {
        setBluetoothState(bluetoothState);

        if (bluetoothState === 'PoweredOn') setScanStatus('start');
        else setScanStatus('stoped');
      },
      true
    );

    return () => {
      bluetoothStateSubscription.remove();
    };
  }, []);

  const isFirsrtAccess = false;

  return isFirsrtAccess ? (
    <QuestionsStack.Navigator initialRouteName="QuestionsScreen">
      <QuestionsStack.Screen
        name="QuestionsScreen"
        options={{
          headerTransparent: true,
          title: false,
          headerTintColor: '#fff',
        }}
        component={QuestionsScreen}
      />
    </QuestionsStack.Navigator>
  ) : (
    <Tab.Navigator
      activeColor="#fff"
      inactiveColor="#000"
      barStyle={{ backgroundColor: '#509AE0' }}
      initialRouteName="Home Stack"
    >
      <Tab.Screen
        name="Home Stack"
        component={MainStackNavigator}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: () => <IconMC name="home" size={20} color="#fff" />,
        }}
      />
      <Tab.Screen
        name="Measurements Stack"
        component={MeasurementsStackNavigator}
        options={{
          tabBarLabel: 'Registros',
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
