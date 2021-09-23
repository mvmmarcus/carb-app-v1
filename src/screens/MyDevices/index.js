/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';

import {
  Text,
  NativeModules,
  NativeEventEmitter,
  TouchableHighlight,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';
import lodash from 'lodash';

import { ActivityIndicator } from 'react-native-paper';
import { Buffer } from 'buffer';

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
import BluetoothContext from '../../contexts/bluetooth';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const glucoseService = '00001808-0000-1000-8000-00805f9b34fb';
const racpCharacteristic = '00002a52-0000-1000-8000-00805f9b34fb';
const gmCharacteristic = '00002a18-0000-1000-8000-00805f9b34fb';
const gmcCharacteristic = '00002a34-0000-1000-8000-00805f9b34fb';

const MyDevicesScreen = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [list, setList] = useState([]);
  const peripherals = new Map();

  const [connectedPeripheral, setConnectedPeripheral] = useState(null);
  const [storagePeripheral, setStoragePeripheral] = useState(null);

  const {
    isEnabled,
    isGettingRecords,
    records,
    setIsGettingRecords,
    setRecords,
  } = useContext(BluetoothContext);

  useEffect(() => {
    (async () => {
      await BleManager.start({ showAlert: false });

      const defaultDevice = await AsyncStorage.getItem('@defaultDevice');
      const parsedDefaultDevice = JSON.parse(defaultDevice);
      setStoragePeripheral(parsedDefaultDevice || null);

      bleManagerEmitter.addListener('BleManagerConnectPeripheral', (args) => {
        console.log('######## BleManagerConnectPeripheral ########');
        console.log('args: ', args);
      });

      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral
      );

      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral
      );
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic
      );

      setInterval(() => {
        (async () => {
          const isConnected = await BleManager.isPeripheralConnected(
            parsedDefaultDevice?.id,
            [glucoseService]
          );

          if (
            !isConnected &&
            !connectedPeripheral &&
            !isConnecting &&
            !isGettingRecords
          ) {
            await startScan();
          }
        })();
      }, 3000);
    })();

    return () => {
      console.log('unmount');
      setConnectedPeripheral(null);

      bleManagerEmitter.removeListener(
        'BleManagerConnectPeripheral',
        (args) => {}
      );

      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral
      );

      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral
      );
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic
      );
    };
  }, []);

  function handleDisconnectedPeripheral(data) {
    const peripheral = data?.peripheral;
    console.log(
      'BoardManager: Disconnected from: ',
      JSON.stringify(peripheral)
    );

    setConnectedPeripheral(null);
    setIsGettingRecords(false);
    setIsConnecting(false);
    setList([]);

    if (teste?.length > 0) {
      if (teste?.length === 1) {
        const findCommonElements = (arr1, arr2) => {
          return arr1?.find((item) =>
            arr2?.map((item2) => item?.fullDate === item2?.fullDate)
          );
        };

        setRecords((prev) => {
          if (findCommonElements(prev, teste)) {
            return prev;
          } else {
            return [...prev, teste[0]];
          }
        });
      } else {
        setRecords(teste);
      }
    }
    teste = [];
  }

  const _sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const sleep = async (ms) => {
    await _sleep(ms);
  };

  async function startScan() {
    if (!isConnecting && !isGettingRecords && !connectedPeripheral) {
      try {
        setIsScanning(true);
        await BleManager.scan([glucoseService], 3, true);
      } catch (error) {
        console.log('BoardManager: Failed to Scan: ', error);
      }
    }
  }

  async function onSelectPeripheral(peripheral) {
    if (peripheral && !isConnecting && !isGettingRecords) {
      console.log('onSelectPeripheral ', JSON.stringify(peripheral));

      const isConnected = await BleManager.isPeripheralConnected(
        peripheral.id,
        [glucoseService]
      );

      if (isConnected) {
        try {
          console.log('Disconnecting BLE From: ', peripheral?.name);
          await BleManager.disconnect(peripheral.id);
        } catch (error) {
          console.log('BoardManager: Failed to Disconnect: ', error);
        }
      } else {
        try {
          await connectToPeripheral(peripheral);
        } catch (error) {
          console.log('BoardManager: Connection error: ', error);
        }
      }
    }
  }

  let teste = [];

  const handleUpdateValueForCharacteristic = (data) => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value
    );

    if (data?.characteristic === gmCharacteristic) {
      const newBuffer = Buffer.from(data.value);
      const year = newBuffer.readUInt16LE(3);
      const month = data.value[5];
      const day = data.value[6];
      const hours = data.value[7];
      const minutes = data.value[8];
      const seconds = data.value[9];
      const value = data.value[12];

      const date = `${year}/${month?.toString()?.padStart(2, '0')}/${day
        ?.toString()
        ?.padStart(2, '0')}`;
      const time = `${hours?.toString()?.padStart(2, '0')}:${minutes
        ?.toString()
        ?.padStart(2, '0')}:${seconds?.toString()?.padStart(2, '0')}`;

      const currentRecord = {
        value,
        date,
        time,
        fullDate: `${date} ${time}`,
      };

      console.log('currentRecord: ', currentRecord);

      teste = [...teste, currentRecord];
    }
  };

  const handleDiscoverPeripheral = async (peripheral) => {
    try {
      peripherals.set(peripheral.id, peripheral);
      setList(Array.from(peripherals.values()));

      // if it is your default peripheral, connect automatically.
      const defaultDevice = await AsyncStorage.getItem('@defaultDevice');
      const parsedDevice = JSON.parse(defaultDevice);

      await sleep(1000);

      if (peripheral?.id === parsedDevice?.id) {
        setConnectedPeripheral(peripheral);
      }

      await sleep(1000);
    } catch (error) {
      console.log('BoardManager Found Peripheral Error: ', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (connectedPeripheral !== null && !isConnecting && !isGettingRecords) {
        await connectToPeripheral(connectedPeripheral);
      }
    })();
  }, [connectedPeripheral?.id]);

  useEffect(() => {
    (async () => {
      const storageRecords = await AsyncStorage.getItem('@records');
      const storageRecordsParsed = JSON.parse(storageRecords);

      console.log('records: ', records);
      console.log('storageRecordsParsed: ', storageRecordsParsed);

      const arrayEquals = (array1, array2) => {
        return lodash?.isEqual(array1, array2);
      };

      console.log('arrayEquals: ', arrayEquals(storageRecordsParsed, records));

      if (!arrayEquals(storageRecordsParsed, records)) {
        await AsyncStorage.setItem('@records', JSON.stringify(records));
      }
    })();
  }, [records]);

  async function connectToPeripheral(peripheral) {
    setIsConnecting(true);
    setIsScanning(false);

    const defaultDevice = await AsyncStorage.getItem('@defaultDevice');
    const storageDevice = JSON.parse(defaultDevice);

    console.log('storagePeripheral: ', storageDevice);
    let isFirstConnect = !storageDevice;

    try {
      const isConnected = await BleManager.isPeripheralConnected(
        peripheral.id,
        [glucoseService]
      );

      if (isConnected) {
        console.log('refreshCache');
        await BleManager.refreshCache(peripheral.id);
      }

      if (!isConnected) {
        console.log('BLE: Connecting to device: ' + peripheral.id);

        await BleManager.connect(peripheral.id);

        await sleep(500);
        console.log('BLE: Retreiving services');
        await BleManager.retrieveServices(peripheral.id);

        await sleep(500);
        console.log('Started notification on: ', gmCharacteristic);
        await BleManager.startNotification(
          peripheral.id,
          glucoseService,
          gmCharacteristic
        );

        await sleep(500);
        console.log('Started notification on: ', gmcCharacteristic);
        await BleManager.startNotification(
          peripheral.id,
          glucoseService,
          gmcCharacteristic
        );

        await sleep(500);
        console.log('Started notification on: ', racpCharacteristic);
        await BleManager.startNotification(
          peripheral.id,
          glucoseService,
          racpCharacteristic
        );

        await AsyncStorage.setItem(
          '@defaultDevice',
          JSON.stringify(peripheral)
        );

        setIsConnecting(false);
        setIsGettingRecords(true);

        setStoragePeripheral(peripheral);
        await sleep(500);
        setConnectedPeripheral(peripheral);

        console.log('Started writing on: ', racpCharacteristic);

        console.log('isFirstConnect: ', isFirstConnect);

        // if firstConnect is true, get all records
        if (isFirstConnect) {
          await BleManager.write(
            peripheral.id,
            glucoseService,
            racpCharacteristic,
            [0x01, 0x01]
          );
        } else {
          await BleManager.write(
            peripheral.id,
            glucoseService,
            racpCharacteristic,
            [0x01, 0x06]
          );
        }
      }
    } catch (error) {
      console.log('BLE: Error connecting: ', error);

      setIsGettingRecords(false);
      setIsConnecting(false);
    }
  }

  const Peripheral = ({ item, isConnected = false, isTouchable = true }) => {
    return isTouchable ? (
      <TouchableHighlight onPress={() => onSelectPeripheral(item)}>
        <PeripheralWrapper>
          <Text>{item?.name}</Text>
          <Text>RSSI: {item.rssi}</Text>
          <Text>{item.id}</Text>
        </PeripheralWrapper>
      </TouchableHighlight>
    ) : (
      <PeripheralWrapper isConnected={isConnected}>
        <PeripheralDescription>Nome: {item?.name}</PeripheralDescription>
        <PeripheralDescription>RSSI: {item.rssi}</PeripheralDescription>
        <PeripheralDescription>Id: {item.id}</PeripheralDescription>
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
                {list?.length !== 0 && !isConnecting && !isGettingRecords && (
                  <SelectDevice>Selecione o seu dispositivo:</SelectDevice>
                )}

                <FlatListStyled
                  data={list}
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
