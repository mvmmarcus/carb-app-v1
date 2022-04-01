import React, { useEffect, useContext } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';

import AuthContext from '../contexts/auth';
import UserContext from '../contexts/user';
import { jsonParse } from '../utils/jsonParse';

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setInsulinParams, setIsFirstAccess, setIsLoading } =
    useContext(UserContext);

  const getInitialValues = async (user) => {
    const userInfosByUid = jsonParse(
      await AsyncStorage.getItem(`@carbs:${user?.uid}`)
    );

    setUser(user);
    setIsFirstAccess(
      userInfosByUid === null ? true : userInfosByUid?.isFirstAccess
    );

    setInsulinParams(userInfosByUid?.insulinParams);
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        getInitialValues(user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
  };
};

export default useAuth;
