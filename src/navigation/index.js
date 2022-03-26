import React, { useContext, useState } from 'react';

import TabNavigator from '#/navigation/TabNavigator';
import AuthNavigator from '#/navigation/AuthNavigator';
import UndismissableModal from '#/components/UndismissableModal';
import AuthContext from '#/contexts/auth';
import AppContext from '#/contexts/app';
import FloatingButton from '../components/FloatingButton';
import { BluetoothProvider } from '#/contexts/bluetooth';
import AddRegisterModal from '../components/AddRegisterModal';

const Navigation = ({}) => {
  const { isAuth } = useContext(AuthContext);
  const { isAddRegisterModalOpen, setIsAddRegisterModalOpen } =
    useContext(AppContext);

  return (
    <>
      {isAuth ? (
        <BluetoothProvider>
          <TabNavigator />
          <UndismissableModal />
          <AddRegisterModal
            isOpen={isAddRegisterModalOpen}
            onClose={() => setIsAddRegisterModalOpen(false)}
          />
          {!isAddRegisterModalOpen && (
            <FloatingButton onPress={() => setIsAddRegisterModalOpen(true)} />
          )}
        </BluetoothProvider>
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default Navigation;
