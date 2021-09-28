/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

import {
  glucoseService,
  gmcCharacteristic,
  gmCharacteristic,
  racpCharacteristic,
} from '../utils/glucoseServices';

const BluetoothContext = createContext({
  isFirstConnection: true,
  isEnabled: false,
  isGettingRecords: false,
  records: [],
  isConnecting: false,
  isScanning: true,
  storagePeripheral: null,
  connectedPeripheral: null,
  discoveredPeripherals: [],
  setIsEnabled: () => {},
  onSelectPeripheral: () => {},
});

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothProvider = ({ children }) => {
  const [isFirstConnection, setIsFirstConnection] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isGettingRecords, setIsGettingRecords] = useState(false);
  const [records, setRecords] = useState([]);
  const [currentRecords, setCurrentRecords] = useState([]);
  const [connectedPeripheral, setConnectedPeripheral] = useState(null);
  const [storagePeripheral, setStoragePeripheral] = useState(null);
  const [discoveredPeripherals, setDiscoveredPeripherals] = useState([]);
  const [discoveredPeripheral, setDiscoveredPeripheral] = useState(null);

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

  useEffect(() => {
    (async () => {
      try {
        const storageRecords = await AsyncStorage.getItem('@records');
        const storageRecordsParsed = JSON.parse(storageRecords);

        if (storageRecordsParsed?.length > 0) {
          setRecords(storageRecordsParsed);
        }
      } catch (error) {
        console.log('error on getting storage records');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (connectedPeripheral !== null && !isConnecting && !isGettingRecords) {
        await connectToPeripheral(connectedPeripheral);
      }
    })();
  }, [connectedPeripheral?.id]);

  useEffect(() => {
    (async () => {
      if (currentRecords?.length > 0) {
        const storageRecords = await AsyncStorage.getItem('@records');
        const storageRecordsParsed = JSON.parse(storageRecords);

        console.log('currentRecords: ', currentRecords);
        console.log('storageRecordsParsed: ', storageRecordsParsed);

        const findCommonElements = (arr1, arr2) => {
          return arr1?.find((item) =>
            arr2?.map((item2) => item?.fullDate === item2?.fullDate)
          );
        };

        console.log(
          'findCommonElements: ',
          findCommonElements(currentRecords, storageRecordsParsed)
        );

        if (findCommonElements(currentRecords, storageRecordsParsed)) {
          return;
        } else {
          if (
            currentRecords?.length === 1 &&
            storageRecordsParsed?.length > 0
          ) {
            setRecords([...storageRecordsParsed, currentRecords[0]]);
            await AsyncStorage.setItem(
              '@records',
              JSON.stringify([...storageRecordsParsed, currentRecords[0]])
            );
          } else {
            setRecords(currentRecords);
            await AsyncStorage.setItem(
              '@records',
              JSON.stringify(currentRecords)
            );
          }
        }
      }
    })();
  }, [currentRecords]);

  const _sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const sleep = async (ms) => {
    await _sleep(ms);
  };

  const connectToPeripheral = async (peripheral) => {
    setIsConnecting(true);
    setIsScanning(false);

    const defaultDevice = await AsyncStorage.getItem('@defaultDevice');
    const storageDevice = JSON.parse(defaultDevice);

    console.log('storagePeripheral: ', storageDevice);
    const isFirstConnect = !storageDevice;
    setIsFirstConnection(isFirstConnect);

    try {
      console.log('BLE: Connecting to device: ' + peripheral.id);

      await BleManager.connect(peripheral.id);

      await sleep(1000);

      const isConnected = await BleManager.isPeripheralConnected(
        peripheral.id,
        [glucoseService]
      );

      if (isConnected) {
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
      }

      await AsyncStorage.setItem('@defaultDevice', JSON.stringify(peripheral));

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
    } catch (error) {
      console.log('BLE: Error connecting: ', error);

      setIsGettingRecords(false);
      setIsConnecting(false);
    }
  };

  const onSelectPeripheral = async (peripheral) => {
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
  };

  const startScan = async () => {
    if (!isConnecting && !isGettingRecords && !connectedPeripheral) {
      try {
        setIsScanning(true);
        await BleManager.scan([glucoseService], 3, false);
      } catch (error) {
        console.log('BoardManager: Failed to Scan: ', error);
      }
    }
  };

  let currentPeripheral = null;

  const handleDiscoverPeripheral = async (peripheral) => {
    try {
      if (currentPeripheral?.id !== peripheral?.id) {
        setDiscoveredPeripheral(peripheral);
      }

      currentPeripheral = peripheral;

      // if it is your default peripheral, connect automatically.
      const defaultDevice = await AsyncStorage.getItem('@defaultDevice');
      const parsedDevice = JSON.parse(defaultDevice);

      if (peripheral?.id === parsedDevice?.id) {
        setConnectedPeripheral(peripheral);
      }
    } catch (error) {
      console.log('BoardManager Found Peripheral Error: ', error);
    }
  };

  useEffect(() => {
    if (discoveredPeripheral !== null) {
      setDiscoveredPeripherals((prev) => [...prev, discoveredPeripheral]);
    }
  }, [discoveredPeripheral?.id]);

  let notificationRecords = [];

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

      notificationRecords = [...notificationRecords, currentRecord];
    }
  };

  const handleDisconnectedPeripheral = (data) => {
    const peripheral = data?.peripheral;
    console.log(
      'BoardManager: Disconnected from: ',
      JSON.stringify(peripheral)
    );

    setConnectedPeripheral(null);
    setIsGettingRecords(false);
    setIsConnecting(false);
    setDiscoveredPeripherals([]);

    console.log('notificationRecords: ', notificationRecords);

    if (notificationRecords?.length > 0) {
      setCurrentRecords(notificationRecords);
    }

    notificationRecords = [];
  };

  return (
    <BluetoothContext.Provider
      value={{
        isEnabled,
        isGettingRecords,
        records,
        isScanning,
        isConnecting,
        connectedPeripheral,
        storagePeripheral,
        discoveredPeripherals,
        isFirstConnection,
        onSelectPeripheral,
        setIsEnabled,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothContext;
