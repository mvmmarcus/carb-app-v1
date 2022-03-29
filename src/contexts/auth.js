/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState } from 'react';

import auth from '@react-native-firebase/auth';

const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signin = async (email, password) => {
    const response = await auth().signInWithEmailAndPassword(email, password);
    return response.user;
  };

  const signup = async (name, email, password) => {
    const response = await auth().createUserWithEmailAndPassword(
      email,
      password
    );

    await auth().currentUser.updateProfile({ displayName: name });

    return { ...response.user, displayName: name };
  };

  const signout = async () => {
    await auth().signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
