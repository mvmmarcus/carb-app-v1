import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';

const AuthNavigator = () => {
  const Stack = createStackNavigator();

  const Index = () => {
    return (
      <View>
        <Text>Index</Text>
      </View>
    );
  };

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
    <Stack.Navigator initialRouteName="Index Screen">
      <Stack.Screen name="Index Screen" component={Index} />
      <Stack.Screen name="Login Screen" component={Login} />
      <Stack.Screen name="Signup Screen" component={Signup} />
      <Stack.Screen name="ForgotPassword Screen" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
