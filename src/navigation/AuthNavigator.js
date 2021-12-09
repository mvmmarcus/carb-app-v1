import React from 'react';
import { Text, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import IndexScreeen from '../screens/Index';

const AuthNavigator = () => {
  const Stack = createStackNavigator();

  const Login = () => {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  };

  const Signup = () => {
    return (
      <View>
        <Text>Register</Text>
      </View>
    );
  };

  const ForgotPassword = () => {
    return (
      <View>
        <Text>Forgot Password</Text>
      </View>
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Index Screen"
    >
      <Stack.Screen name="Index Screen" component={IndexScreeen} />
      <Stack.Screen name="Login Screen" component={Login} />
      <Stack.Screen name="Signup Screen" component={Signup} />
      <Stack.Screen name="ForgotPassword Screen" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
