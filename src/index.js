import 'react-native-gesture-handler';

import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import DrawerNavigator from '../src/navigation/DrawerNavigator';
import { BluetoothProvider } from './contexts/bluetooth';
import AuthNavigator from './navigation/AuthNavigator';
import UndismissableModal from './components/UndismissableModal';

const App = () => {
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
