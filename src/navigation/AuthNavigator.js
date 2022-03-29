import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IndexScreeen from '../screens/Index';
import SignInScreeen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
// import SmsVerificationScreen from '../screens/SmsVerification';
import ForgotPasswordScreen from '../screens/ForgotPassword';

import { theme } from '../styles/theme';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();

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
          title: '',
          headerTintColor: $white,
        }}
        name="SignInScreen"
        component={SignInScreeen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
          headerTintColor: $white,
        }}
        name="SignUpScreen"
        component={SignUpScreen}
      />
      {/* <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
          headerTintColor: $white,
        }}
        name="SmsVerificationScreen"
        component={SmsVerificationScreen}
      /> */}
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
          headerTintColor: $white,
        }}
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
