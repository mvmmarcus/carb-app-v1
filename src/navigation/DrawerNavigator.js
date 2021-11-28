/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { BluetoothStatus } from 'react-native-bluetooth-status';

import DrawerContent from '../components/DrawerContent';
import BluetoothContext from '../contexts/bluetooth';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { setIsBluetoothEnabled, setIsAcceptedPermissions, setScanStatus } =
    useContext(BluetoothContext);

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) {
          console.log('Permission is OK result: ', result);
          setIsAcceptedPermissions(true);
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((response) => {
            console.log('response: ', response);
            if (response === 'granted') {
              setIsAcceptedPermissions(true);
              console.log('User accept');
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
    (async () => {
      const isEnabled = await BluetoothStatus.state();

      setIsBluetoothEnabled(isEnabled);

      BluetoothStatus.addListener((isBluetoothOn) => {
        if (isBluetoothOn) setScanStatus('start');
        else setScanStatus('stoped');

        setIsBluetoothEnabled(isBluetoothOn);
      });
    })();

    return () => {
      BluetoothStatus.removeListener();
    };
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
