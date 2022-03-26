/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState } from 'react';

const AppContext = createContext({
  isAddRegisterModalOpen: true,
  setIsAddRegisterModalOpen: () => {},
});

export const AppProvider = ({ children }) => {
  const [isAddRegisterModalOpen, setIsAddRegisterModalOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isAddRegisterModalOpen,
        setIsAddRegisterModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
