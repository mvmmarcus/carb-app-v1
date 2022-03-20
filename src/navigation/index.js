import React, { useContext } from 'react';

import TabNavigator from '#/navigation/TabNavigator';
import AuthNavigator from '#/navigation/AuthNavigator';
import UndismissableModal from '#/components/UndismissableModal';
import AuthContext from '#/contexts/auth';
import { BluetoothProvider } from '#/contexts/bluetooth';

const Navigation = ({}) => {
  const { isAuth } = useContext(AuthContext);

  return (
    <>
      {isAuth ? (
        <BluetoothProvider>
          <TabNavigator />
          <UndismissableModal />
        </BluetoothProvider>
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default Navigation;
