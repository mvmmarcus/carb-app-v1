import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import IndexScreeen from '../screens/Index';
import SignInScreeen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import SmsVerificationScreen from '../screens/SmsVerification';
import CreatePasswordScreen from '../screens/CreatePassword';

import { theme } from '../styles/theme';

const AuthNavigator = () => {
  const Stack = createStackNavigator();

  const { $white } = theme;

  return (
    <Stack.Navigator initialRouteName="IndexScreen">
      <Stack.Screen
        options={{ headerShown: false }}
        name="IndexScreen"
        component={IndexScreeen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: false,
          headerTintColor: $white,
        }}
        name="SignInScreen"
        component={SignInScreeen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: false,
          headerTintColor: $white,
        }}
        name="SignUpScreen"
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: false,
          headerTintColor: $white,
        }}
        name="SmsVerificationScreen"
        component={SmsVerificationScreen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: false,
          headerTintColor: $white,
        }}
        name="CreatePasswordScreen"
        component={CreatePasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
