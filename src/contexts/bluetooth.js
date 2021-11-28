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
  isBluetoothEnabled: false,
  isGettingRecords: false,
  isAcceptedPermissions: false,
  records: [],
  isConnecting: false,
  scanStatus: 'start',
  storagePeripheral: null,
  connectedPeripheral: null,
  discoveredPeripherals: [],
  setScanStatus: () => {},
  setIsAcceptedPermissions: () => {},
  setIsBluetoothEnabled: () => {},
  onSelectPeripheral: () => {},
});

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothProvider = ({ children }) => {
  const [isFirstConnection, setIsFirstConnection] = useState(true);
  const [scanStatus, setScanStatus] = useState('start');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isAcceptedPermissions, setIsAcceptedPermissions] = useState(false);
  const [isGettingRecords, setIsGettingRecords] = useState(false);
  const [records, setRecords] = useState([]);
  const [connectedPeripheral, setConnectedPeripheral] = useState(null);
  const [storagePeripheral, setStoragePeripheral] = useState(null);
  const [discoveredPeripherals, setDiscoveredPeripherals] = useState([]);
  const [discoveredPeripheral, setDiscoveredPeripheral] = useState(null);
  const [isResetListeners, setIsResetListeners] = useState(false);
  let newRecords = [];
  let currentDiscoveredPeripheral = null;
  let disconnectScanToggle = false;

  useEffect(() => {
    (async () => {
      if (isAcceptedPermissions && isBluetoothEnabled) {
        await BleManager.start({ showAlert: false });
        await sleep(500);

        const defaultPeripheral = await AsyncStorage.getItem(
          '@defaultPeripheral'
        );
        const defaultPeripheralParsed = JSON.parse(defaultPeripheral);

        if (defaultPeripheralParsed) {
          setStoragePeripheral(defaultPeripheralParsed);
          setIsFirstConnection(false);
        }
      }
    })();
  }, [isAcceptedPermissions, isBluetoothEnabled]);

  useEffect(() => {
    console.log('reset');

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
  }, [isResetListeners]);

  useEffect(() => {
    console.log('scanStatus: ', scanStatus);

    (async () => {
      if (
        isAcceptedPermissions &&
        isBluetoothEnabled &&
        scanStatus === 'start'
      ) {
        await startScan();
      }
    })();
  }, [isAcceptedPermissions, isBluetoothEnabled, scanStatus]);

  useEffect(() => {
    console.log('isBluetoothEnabled: ', isBluetoothEnabled);

    if (!isBluetoothEnabled) {
      setDiscoveredPeripherals([]);
      setDiscoveredPeripheral(null);
    }

    setIsResetListeners((prev) => !prev);
  }, [isBluetoothEnabled]);

  useEffect(() => {
    if (discoveredPeripheral) {
      const peripheral = discoveredPeripherals.find(
        (item) => item?.id === discoveredPeripheral?.id
      );

      if (!peripheral) {
        setDiscoveredPeripherals((prev) => [...prev, discoveredPeripheral]);
      }
    }
  }, [discoveredPeripheral?.id]);

  useEffect(() => {
    (async () => {
      if (
        storagePeripheral &&
        storagePeripheral?.id === discoveredPeripheral?.id &&
        !connectedPeripheral &&
        !isGettingRecords &&
        !isConnecting
      ) {
        setIsConnecting(true);
        await sleep(500);
        await onSelectPeripheral(storagePeripheral);
      }
    })();
  }, [storagePeripheral, discoveredPeripheral?.id]);

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const startNotifications = async (peripheral) => {
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
  };

  const writeCommands = async (peripheral) => {
    await BleManager.write(
      peripheral?.id,
      glucoseService,
      racpCharacteristic,
      [0x01, 0x01]
    );

    if (storagePeripheral?.id !== peripheral?.id) {
      await AsyncStorage.setItem(
        '@defaultPeripheral',
        JSON.stringify(peripheral)
      );
      setStoragePeripheral(peripheral);
    }

    setConnectedPeripheral(peripheral);
    setIsConnecting(false);
    setIsGettingRecords(true);
  };

  const connectToPeripheral = async (peripheral) => {
    console.log('BLE: Connecting to device: ' + peripheral.id);
    await BleManager.stopScan();

    await BleManager.connect(peripheral.id);
    await sleep(500);

    console.log('BLE: Retreiving services');
    await BleManager.retrieveServices(peripheral.id);
  };

  const onSelectPeripheral = async (peripheral) => {
    try {
      setIsConnecting(true);

      await connectToPeripheral(peripheral);
      await sleep(500);

      await startNotifications(peripheral);
      await sleep(500);

      await writeCommands(peripheral);
    } catch (error) {
      setIsConnecting(false);
      console.log('onSelectPeripheral error: ', error);
    }
  };

  const startScan = async () => {
    try {
      await BleManager.scan([glucoseService], 0, false);
      setScanStatus('scanning');
    } catch (error) {
      setScanStatus('error');
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
      setRecords(newRecords);
      setIsGettingRecords(false);
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

    setIsResetListeners((prev) => !prev);
    setIsGettingRecords(false);
    setIsConnecting(false);
    setDiscoveredPeripheral(null);
    setDiscoveredPeripherals([]);
    setConnectedPeripheral(null);

    // This condition is necessary because BleManagerDisconnectPeripheral event is called many times
    if (!disconnectScanToggle) {
      setScanStatus('start');
      disconnectScanToggle = true;
    } else {
      disconnectScanToggle = false;
    }

    currentDiscoveredPeripheral = null;
    newRecords = [];
  };

  const handleStopScan = () => {
    console.log('handleStopScan');
  };

  console.log('render');

  return (
    <BluetoothContext.Provider
      value={{
        isBluetoothEnabled,
        isGettingRecords,
        records,
        scanStatus,
        isConnecting,
        connectedPeripheral,
        storagePeripheral,
        discoveredPeripherals,
        isFirstConnection,
        isAcceptedPermissions,
        setScanStatus,
        setIsAcceptedPermissions,
        onSelectPeripheral,
        setIsBluetoothEnabled,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothContext;
