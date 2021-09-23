import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { BluetoothStatus } from 'react-native-bluetooth-status';

import DrawerNavigator from '../src/navigation/DrawerNavigator';
import { BluetoothProvider } from './contexts/bluetooth';
import AuthNavigator from './navigation/AuthNavigator';

const App = () => {
  useEffect(() => {
    (async () => {
      await BluetoothStatus.state();
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((response) => {
            console.log('response: ', response);
            if (response) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
  }, []);

  const isAuth = true;

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          {isAuth ? (
            <BluetoothProvider>
              <DrawerNavigator />
            </BluetoothProvider>
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
