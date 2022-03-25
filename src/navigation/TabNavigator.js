import React, { useContext, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFo from 'react-native-vector-icons/Fontisto';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import QuestionsScreen from '#/screens/Questions';
import BluetoothContext from '#/contexts/bluetooth';
import AuthContext from '#/contexts/auth';
import { theme } from '#/styles/theme';
import {
  MainStackNavigator,
  RegistersStackNavigator,
  MyDevicesStackNavigator,
} from './StackNavigator';

const Tab = createMaterialBottomTabNavigator();
const QuestionsStack = createStackNavigator();

IconFA.loadFont();
IconFo.loadFont();
IconMC.loadFont();

const BottomTabNavigator = () => {
  const { setIsAcceptedPermissions, setScanStatus, setBluetoothState } =
    useContext(BluetoothContext);
  const { isFirstAccess } = useContext(AuthContext);
  const { $white, $secondary, $primary, $gray } = theme;

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

  return isFirstAccess ? (
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
      activeColor={$secondary}
      inactiveColor={$gray}
      barStyle={{
        backgroundColor: $white,
      }}
      initialRouteName="Home Stack"
    >
      <Tab.Screen
        name="Home Stack"
        component={MainStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => {
            return (
              <IconMC
                name="home"
                size={20}
                color={focused ? $secondary : $gray}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Registers Stack"
        component={RegistersStackNavigator}
        options={{
          tabBarLabel: 'Registros',
          tabBarIcon: ({ focused }) => (
            <IconMC
              name="chart-bar"
              size={20}
              color={focused ? $secondary : $gray}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Sync Stack"
        component={MyDevicesStackNavigator}
        options={{
          tabBarLabel: 'Sincronizar',
          tabBarIcon: ({ focused }) => (
            <IconMC
              name="sync"
              size={20}
              color={focused ? $secondary : $gray}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Settings Stack"
        component={MyDevicesStackNavigator}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ focused }) => (
            <IconMC
              name="menu"
              size={20}
              color={focused ? $secondary : $gray}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
