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
  const [connectedPeripheral, setConnectedPeripheral] = useState(null);
  const [storagePeripheral, setStoragePeripheral] = useState(null);
  const [discoveredPeripherals, setDiscoveredPeripherals] = useState([]);
  const [discoveredPeripheral, setDiscoveredPeripheral] = useState(null);
  let newRecords = [];
  let currentDiscoveredPeripheral = null;

  useEffect(() => {
    (async () => {
      await BleManager.start({ showAlert: false });

      const defaultPeripheral = await AsyncStorage.getItem(
        '@defaultPeripheral'
      );
      const defaultPeripheralParsed = JSON.parse(defaultPeripheral);

      if (defaultPeripheralParsed) {
        setStoragePeripheral(defaultPeripheralParsed);
        setIsFirstConnection(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log('connectedPeripheral: ', connectedPeripheral);

      if (!connectedPeripheral) {
        await startScan();
      }
    })();
  }, [connectedPeripheral]);

  useEffect(() => {
    const connectPeripheralSubscription = bleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      (args) => {
        console.log('######## BleManagerConnectPeripheral ########');
        console.log('args: ', args);
      }
    );

    const discoverPeripheralSubscription = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral
    );

    const disconnectPeripheralSubscription = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral
    );

    const didUpdateValueForCharacteristicSubscription =
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic
      );

    const stopScanSubscripttion = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan
    );

    return () => {
      console.log('unmount');

      connectPeripheralSubscription?.remove();
      discoverPeripheralSubscription?.remove();
      disconnectPeripheralSubscription?.remove();
      didUpdateValueForCharacteristicSubscription?.remove();
      stopScanSubscripttion?.remove();
    };
  }, []);

  useEffect(() => {
    if (discoveredPeripheral) {
      const peripheral = discoveredPeripherals.find(
        (item) => item?.id === discoveredPeripheral?.id
      );

      if (!peripheral) {
        setDiscoveredPeripherals((prev) => [...prev, discoveredPeripheral]);
      }
    }
  }, [discoveredPeripheral]);

  useEffect(() => {
    (async () => {
      if (
        storagePeripheral &&
        storagePeripheral?.id === discoveredPeripheral?.id &&
        !connectedPeripheral &&
        !isGettingRecords &&
        !isConnecting
      ) {
        await onSelectPeripheral(storagePeripheral);
      }
    })();
  }, [storagePeripheral, discoveredPeripheral?.id]);

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const startNotifications = async (peripheral) => {
    try {
      await BleManager.startNotification(
        peripheral?.id,
        glucoseService,
        gmCharacteristic
      );
      console.log('Started notification on: ', gmCharacteristic);
      await sleep(500);

      await BleManager.startNotification(
        peripheral?.id,
        glucoseService,
        gmcCharacteristic
      );
      console.log('Started notification on: ', gmcCharacteristic);
      await sleep(500);

      await BleManager.startNotification(
        peripheral?.id,
        glucoseService,
        racpCharacteristic
      );
      console.log('Started notification on: ', racpCharacteristic);
    } catch (error) {
      setIsGettingRecords(false);

      console.log('error on starting notifications: ', error);
    }
  };

  const writeCommands = async (peripheral) => {
    try {
      await BleManager.write(
        peripheral?.id,
        glucoseService,
        racpCharacteristic,
        [0x01, 0x01]
      );
    } catch (error) {
      setIsGettingRecords(false);
      console.log('error on writing commands: ', error);
    }
  };

  const connectToPeripheral = async (peripheral) => {
    setIsConnecting(true);
    try {
      console.log('BLE: Connecting to device: ' + peripheral.id);
      await BleManager.stopScan();

      await BleManager.connect(peripheral.id);
      await sleep(500);

      console.log('BLE: Retreiving services');
      await BleManager.retrieveServices(peripheral.id);

      const defaultPeripheral = await AsyncStorage.getItem(
        '@defaultPeripheral'
      );
      const defaultPeripheralParsed = JSON.parse(defaultPeripheral);

      console.log('defaultPeripheralParsed: ', defaultPeripheralParsed);

      if (!defaultPeripheralParsed) {
        setIsFirstConnection(false);
        await AsyncStorage.setItem(
          '@defaultPeripheral',
          JSON.stringify(peripheral)
        );
      }

      setConnectedPeripheral(peripheral);
      setIsConnecting(false);
      setIsGettingRecords(true);
    } catch (error) {
      setIsConnecting(false);
      console.log('BLE: Error connecting: ', error);
    }
  };

  const onSelectPeripheral = async (peripheral) => {
    await connectToPeripheral(peripheral);
    await sleep(500);

    await startNotifications(peripheral);
    await sleep(500);

    await writeCommands(peripheral);
  };

  const startScan = async () => {
    setIsScanning(true);
    console.log('is scanning');
    try {
      await BleManager.scan([glucoseService], 0, false);
    } catch (error) {
      setIsScanning(false);
      console.log('BoardManager: Failed to Scan: ', error);
    }
  };

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('discovered pheriferal: ', peripheral);

    if (peripheral?.id !== currentDiscoveredPeripheral?.id) {
      currentDiscoveredPeripheral = peripheral;

      setDiscoveredPeripheral(peripheral);
    }
  };

  const handleUpdateValueForCharacteristic = (data) => {
    // console.log(
    //   'Received data from ' +
    //     data.peripheral +
    //     ' characteristic ' +
    //     data.characteristic,
    //   data.value
    // );

    if (data?.characteristic === racpCharacteristic) {
      console.log('all data received');
      setIsGettingRecords(false);
      setRecords(newRecords);
    }

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
      newRecords = [...newRecords, currentRecord];
    }
  };

  const handleDisconnectedPeripheral = (data) => {
    const peripheral = data?.peripheral;

    console.log(
      'BoardManager: Disconnected from: ',
      JSON.stringify(peripheral)
    );

    setDiscoveredPeripheral(null);
    setDiscoveredPeripherals([]);
    setConnectedPeripheral(null);
    currentDiscoveredPeripheral = null;
    newRecords = [];
  };

  const handleStopScan = () => {
    console.log('scan is stopped');
    setIsScanning(false);
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
