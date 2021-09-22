/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect } from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { BluetoothStatus } from 'react-native-bluetooth-status';

import DrawerContent from '../components/DrawerContent';
import RootNavigator from './RootNavigator';
import BluetoothContext from '../contexts/bluetooth';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { setIsEnabled } = useContext(BluetoothContext);

  useEffect(() => {
    (async () => {
      const isEnabled = await BluetoothStatus.state();
      console.log('isEnabled: ', isEnabled);
      setIsEnabled(isEnabled);

      BluetoothStatus.addListener((state) => setIsEnabled(state));
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
      <Drawer.Screen name="Root" component={RootNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
