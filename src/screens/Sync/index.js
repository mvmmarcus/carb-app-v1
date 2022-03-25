import React, { useContext, useState } from 'react';
import { View } from 'react-native';

import FallbackMessage from '../../components/FallbackMessage';
import Peripheral from '../../components/Peripheral';
import Nav from '../../components/Nav';
import ScreenWrapper from '#/components/ScreenWrapper';
import BluetoothContext from '../../contexts/bluetooth';

import { getStyle } from './styles';

const SyncScreen = () => {
  const {
    bluetoothState,
    isAcceptedPermissions,
    discoveredPeripherals,
    connectedPeripheral,
    storagePeripheral,
  } = useContext(BluetoothContext);
  const [activeNav, setActiveNav] = useState('close');

  const styles = getStyle({});

  console.log({
    discoveredPeripherals,
    connectedPeripheral,
    storagePeripheral,
  });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {isAcceptedPermissions ? (
          bluetoothState === 'PoweredOn' ? (
            <View style={styles.content}>
              <View style={styles.navContainer}>
                <Nav
                  options={[
                    { label: 'Por perto', value: 'close' },
                    { label: 'Histórico', value: 'history' },
                  ]}
                  onChange={setActiveNav}
                  activeOption={activeNav}
                />
              </View>
              {discoveredPeripherals?.length > 0 ? (
                discoveredPeripherals?.map((item) => (
                  <Peripheral
                    {...item}
                    isConnected={connectedPeripheral?.id === item?.id}
                  />
                ))
              ) : (
                <FallbackMessage
                  title="Nenhum dispositivo encontrado"
                  subtitle="Verifique se o dispositivo está ligado e em modo de pareamento"
                  icon={{ name: 'text-search', size: 80 }}
                />
              )}
            </View>
          ) : (
            <FallbackMessage
              title="Bluettoth desligado"
              subtitle="É preciso ativar o bluetooth para seguir com o emparelhamento"
              icon={{ name: 'bluetooth-off', size: 80 }}
            />
          )
        ) : (
          <FallbackMessage
            title="Permissões insuficientes"
            subtitle="Vá até as configurações do app no seu dispositivo e aceite as permissões solicitadas!"
            icon={{ name: 'alert-outline', size: 80 }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default SyncScreen;
