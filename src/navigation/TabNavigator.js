import React, { useContext, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IconFA from 'react-native-vector-icons/FontAwesome';
import IconFo from 'react-native-vector-icons/Fontisto';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import QuestionsScreen from '../screens/Questions';
import BluetoothContext from '../contexts/bluetooth';
import UserContext from '../contexts/user';
import { theme } from '../styles/theme';
import {
  MainStackNavigator,
  MenuStackNavigator,
  RegistersStackNavigator,
  SyncStackNavigator,
} from './StackNavigator';

const Tab = createBottomTabNavigator();
const QuestionsStack = createNativeStackNavigator();

IconFA.loadFont();
IconFo.loadFont();
IconMC.loadFont();

const BottomTabNavigator = () => {
  const { setIsAcceptedPermissions, setScanStatus, setBluetoothState } =
    useContext(BluetoothContext);
  const { isFirstAccess } = useContext(UserContext);
  const { $white, $secondary, $gray } = theme;

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) {
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
            if (response === 'granted') {
              setIsAcceptedPermissions(true);

              BluetoothStateManager.getState()
                .then((bluetoothState) => {
                  setBluetoothState(bluetoothState);
                })
                .catch(() => setBluetoothState('PoweredOff'));
            } else {
              setIsAcceptedPermissions(false);
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
          title: '',
          headerTintColor: '#fff',
        }}
        component={QuestionsScreen}
      />
    </QuestionsStack.Navigator>
  ) : (
    <Tab.Navigator
      barStyle={{
        backgroundColor: $white,
      }}
      screenOptions={{
        tabBarStyle: {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: $secondary,
      }}
      initialRouteName="HomeStack"
    >
      <Tab.Screen
        name="HomeStack"
        component={MainStackNavigator}
        options={{
          headerShown: false,
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
        name="RegistersStack"
        component={RegistersStackNavigator}
        options={{
          headerShown: false,
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
        name="SyncStack"
        component={SyncStackNavigator}
        options={{
          headerShown: false,
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
        name="MenuStack"
        component={MenuStackNavigator}
        options={{
          headerShown: false,
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
