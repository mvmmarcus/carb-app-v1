/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState } from 'react';

const AuthContext = createContext({
  isAuth: false,
  isFirstAccess: false,
  setIsAuth: () => {},
  setIsFirstAccess: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isFirstAccess,
        setIsAuth,
        setIsFirstAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
