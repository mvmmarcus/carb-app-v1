import React, { useContext } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';
import { useEffect } from 'react/cjs/react.development';

import BluetoothContext from '../../contexts/bluetooth';

import {
  BluetoothStatusText,
  CenteredCaption,
  Container,
  CustomText,
  FlatListStyled,
  LoadingSection,
  PeripheralDescription,
  PeripheralWrapper,
  SafeArea,
  SelectDevice,
} from './styles';

const MyDevicesScreen = () => {
  const {
    isEnabled,
    isGettingRecords,
    discoveredPeripherals,
    isConnecting,
    connectedPeripheral,
    storagePeripheral,
    isScanning,
    onSelectPeripheral,
  } = useContext(BluetoothContext);

  const Peripheral = ({ item, isConnected = false, isTouchable = true }) => {
    return isTouchable ? (
      <TouchableHighlight onPress={() => onSelectPeripheral(item)}>
        <PeripheralWrapper>
          <Text>{item?.name}</Text>
          <Text>RSSI: {item?.rssi}</Text>
          <Text>{item?.id}</Text>
        </PeripheralWrapper>
      </TouchableHighlight>
    ) : (
      <PeripheralWrapper isConnected={isConnected}>
        <PeripheralDescription>Nome: {item?.name}</PeripheralDescription>
        <PeripheralDescription>RSSI: {item?.rssi}</PeripheralDescription>
        <PeripheralDescription>Id: {item?.id}</PeripheralDescription>
        <PeripheralDescription>
          Status:{' '}
          {isConnecting
            ? 'Conectando'
            : isConnected
            ? 'Conectado'
            : 'Desconectado'}
        </PeripheralDescription>
      </PeripheralWrapper>
    );
  };

  useEffect(() => {
    console.log('connectedPeripheral from my devices: ', connectedPeripheral);
  }, [connectedPeripheral]);

  return (
    <SafeArea>
      {isEnabled ? (
        <Container>
          {storagePeripheral && (
            <Peripheral
              item={storagePeripheral}
              isTouchable={false}
              isConnected={connectedPeripheral}
            />
          )}
          <LoadingSection>
            {isScanning &&
              !storagePeripheral &&
              !isConnecting &&
              !isGettingRecords && (
                <>
                  <CustomText>Buscando dispositivos</CustomText>
                  <ActivityIndicator animating={true} />
                </>
              )}

            {isConnecting && (
              <>
                <CustomText>Connectando</CustomText>
                <ActivityIndicator animating={true} />
              </>
            )}

            {isGettingRecords && (
              <>
                <CustomText>Atualizando registros</CustomText>
                <ActivityIndicator animating={true} />
              </>
            )}
          </LoadingSection>

          {!connectedPeripheral &&
            !isGettingRecords &&
            (storagePeripheral ? (
              <CenteredCaption>
                Glicosímetro desconectado. {'\n'}
                Por favor, ligue o seu dispositivo e aguarde o {'\n'}
                emparelhamento automático.
              </CenteredCaption>
            ) : (
              <View>
                {discoveredPeripherals?.length !== 0 &&
                  !isConnecting &&
                  !isGettingRecords && (
                    <SelectDevice>Selecione o seu dispositivo:</SelectDevice>
                  )}

                <FlatListStyled
                  data={discoveredPeripherals}
                  renderItem={({ item }) => <Peripheral item={item} />}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <CenteredCaption>
                      Nenhum dispositivo encontrado. {'\n'}
                      Por favor, ligue o seu glicosímetro e {'\n'}
                      inicie o emparelhamento.
                    </CenteredCaption>
                  }
                />
              </View>
            ))}
        </Container>
      ) : (
        <Container>
          <BluetoothStatusText>Bluettoth desligado</BluetoothStatusText>
          <CenteredCaption>
            É preciso ativar o bluetooth {'\n'}
            para seguir com o emparelhamento
          </CenteredCaption>
        </Container>
      )}
    </SafeArea>
  );
};

export default MyDevicesScreen;
