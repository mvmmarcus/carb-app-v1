import React, { useContext } from 'react';

import SplashScreen from '../screens/Splash';
import AddRegisterModal from '../components/AddRegisterModal';
import useAuth from '../hooks/useAuth';
import TabNavigator from '../navigation/TabNavigator';
import AuthNavigator from '../navigation/AuthNavigator';
import UndismissableModal from '../components/UndismissableModal';
import UserContext from '../contexts/user';
import FloatingButton from '../components/FloatingButton';
import { BluetoothProvider } from '../contexts/bluetooth';

const Navigation = ({}) => {
  const { user } = useAuth();
  const {
    isAddRegisterModalOpen,
    isFirstAccess,
    isLoading,
    isEditInfos,
    setIsAddRegisterModalOpen,
  } = useContext(UserContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      {!!user ? (
        <BluetoothProvider>
          <TabNavigator />
          <UndismissableModal />
          {!!isAddRegisterModalOpen && (
            <AddRegisterModal
              isOpen={isAddRegisterModalOpen}
              onClose={() => setIsAddRegisterModalOpen(false)}
            />
          )}
          {!isFirstAccess && !isAddRegisterModalOpen && !isEditInfos && (
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
