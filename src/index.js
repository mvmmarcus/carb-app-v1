import 'react-native-gesture-handler';

import React, { useEffect } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { BluetoothStatus } from 'react-native-bluetooth-status';

import DrawerNavigator from '../src/navigation/DrawerNavigator';
import { BluetoothProvider } from './contexts/bluetooth';
import AuthNavigator from './navigation/AuthNavigator';
import UndismissableModal from './components/UndismissableModal';

const App = () => {
  useEffect(() => {
    (async () => {
      await BluetoothStatus.state();
    })();
  }, []);

  const isAuth = true;

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          {isAuth ? (
            <BluetoothProvider>
              <DrawerNavigator />
              <UndismissableModal />
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
