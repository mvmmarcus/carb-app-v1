/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState } from 'react';

const AppContext = createContext({
  isAddRegisterModalOpen: false,
  isLoading: true,
  isFirstAccess: true,
  isEditInfos: false,
  insulinParams: null,
  setIsEditInfos: () => {},
  setInsulinParams: () => {},
  setIsFirstAccess: () => {},
  setIsLoading: () => {},
  setIsAddRegisterModalOpen: () => {},
});

export const AppProvider = ({ children }) => {
  const [isAddRegisterModalOpen, setIsAddRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstAccess, setIsFirstAccess] = useState(true);
  const [isEditInfos, setIsEditInfos] = useState(false);
  const [insulinParams, setInsulinParams] = useState(null);

  return (
    <AppContext.Provider
      value={{
        isAddRegisterModalOpen,
        isLoading,
        isFirstAccess,
        insulinParams,
        isEditInfos,
        setIsEditInfos,
        setInsulinParams,
        setIsFirstAccess,
        setIsLoading,
        setIsAddRegisterModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
