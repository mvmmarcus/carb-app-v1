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

      bleManagerEmitter.addListener('BleManagerStopScan', () => {
        console.log('scan is stopped');
        setIsScanning(false);
      });

      await startScan();
    })();

    return () => {
      console.log('unmount');
      bleManagerEmitter.removeListener('BleManagerConnectPeripheral');
      bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral');
      bleManagerEmitter.removeListener('BleManagerStopScan');
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic'
      );
    };
  }, []);

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
      console.log('error on starting notifications: ', error);
    }
  };

  const writeCommands = async (peripheral) => {
    try {
      await BleManager.write(
        peripheral?.id,
        glucoseService,
        racpCharacteristic,
        [0x01, 0x06]
      );
    } catch (error) {
      console.log('error on writing commands: ', error);
    }
  };

  const connectToPeripheral = async (peripheral) => {
    setIsConnecting(true);
    try {
      console.log('BLE: Connecting to device: ' + peripheral.id);
      await BleManager.connect(peripheral.id);
      await sleep(500);

      console.log('BLE: Retreiving services');
      await BleManager.retrieveServices(peripheral.id);

      setConnectedPeripheral(peripheral);
      setIsConnecting(false);
    } catch (error) {
      setIsConnecting(false);
      console.log('BLE: Error connecting: ', error);
    }
  };

  const onSelectPeripheral = async (peripheral) => {
    await BleManager.stopScan();
    await sleep(300);

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
  };

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
    }
  };

  const handleDisconnectedPeripheral = (data) => {
    const peripheral = data?.peripheral;

    console.log(
      'BoardManager: Disconnected from: ',
      JSON.stringify(peripheral)
    );

    setConnectedPeripheral(null);
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
