/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { Buffer } from 'buffer';

import {
  glucoseServiceUUID,
  gmcCharacteristicUUID,
  gmCharacteristicUUID,
  racpCharacteristicUUID,
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

import { BleManager } from 'react-native-ble-plx';
import { AppState } from 'react-native';

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
  const blePlxManager = new BleManager();

  useLayoutEffect(() => {
    (async () => {
      const state = await blePlxManager.state();
      console.log('initial state: ', state);

      if (state === 'PoweredOn') setIsEnabled(true);
      if (state === 'PoweredOff') setIsEnabled(false);

      const defaultDevice = await AsyncStorage.getItem('@currentDevice');
      const parsedDefaultDevice = JSON.parse(defaultDevice);
      console.log('parsedDefaultDevice: ', parsedDefaultDevice);
      if (parsedDefaultDevice) {
        setIsFirstConnection(false);
        setStoragePeripheral(parsedDefaultDevice);
      }
    })();
  }, []);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      (newState) => console.log('AppState changed to: ', newState)
    );

    const stateSubscription = blePlxManager.onStateChange((state) => {
      console.log('state changed: ', state);

      if (state === 'PoweredOn') setIsEnabled(true);
      if (state === 'PoweredOff') setIsEnabled(false);
    });

    const onDisconnectSubscription = blePlxManager.onDeviceDisconnected(
      connectedPeripheral?.id,
      (disconnectError, disconnectedDevice) => {
        if (disconnectError) {
          console.log('disconnectError: ', disconnectError);
          return;
        }

        console.log(`Device ${disconnectedDevice?.id} was disconnected`);
      }
    );

    return () => {
      console.log('unmount');
      appStateSubscription?.remove();
      stateSubscription?.remove();
      onDisconnectSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (isEnabled) {
      startScan();
    }
  }, [isEnabled]);

  useEffect(() => {
    console.log('connectedPeripheral: ', connectedPeripheral);
  }, [connectedPeripheral]);

  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const startNotifications = async (device) => {
    setIsGettingRecords(true);
    await sleep(500);

    blePlxManager.monitorCharacteristicForDevice(
      device?.id,
      glucoseServiceUUID,
      gmCharacteristicUUID,
      (gmError, gmCharacteristic) => {
        if (gmError) {
          console.log('error on monitoring gmCharacteristic: ', gmError);
          return;
        }

        if (gmCharacteristic?.value) {
          const values = Buffer.from(gmCharacteristic?.value, 'base64');
          const data = Array.from(values);
          console.log('gmCharacteristic data: ', data);
          setRecords((prev) => [...prev, data[12]]);
        }
      }
    );

    await sleep(500);

    blePlxManager.monitorCharacteristicForDevice(
      device?.id,
      glucoseServiceUUID,
      gmcCharacteristicUUID,
      (gmcError) => {
        if (gmcError) {
          console.log('error on monitoring gmcCharacteristic: ', gmcError);
          return;
        }
      }
    );

    await sleep(500);

    blePlxManager.monitorCharacteristicForDevice(
      device?.id,
      glucoseServiceUUID,
      racpCharacteristicUUID,
      (racpError, racpCharacteristic) => {
        if (racpError) {
          console.log('error on monitoring racpCharacteristic: ', racpError);
          return;
        }

        if (racpCharacteristic?.value) {
          console.log(
            'racpCharacteristic value: ',
            Buffer.from(racpCharacteristic?.value, 'base64')
          );
          console.log('all data is received');
          setIsGettingRecords(false);
        }
      }
    );
  };

  const writeCommands = async (device) => {
    var myData = '0x0101';

    const dataMostSignificantByte = (myData >> 8) & 0xff;
    const dataLeastSignificantByte = myData & 0xff;

    const dataByteArrayInLittleEndian = [
      dataLeastSignificantByte,
      dataMostSignificantByte,
    ];
    const dataInBase64 = Buffer.from(dataByteArrayInLittleEndian).toString(
      'base64'
    );

    try {
      await blePlxManager.writeCharacteristicWithResponseForDevice(
        device?.id,
        glucoseServiceUUID,
        racpCharacteristicUUID,
        dataInBase64
      );
    } catch (error) {
      console.log('error on writing commands: ', error);
    }
  };

  const connectToPeripheral = async (device) => {
    blePlxManager.stopDeviceScan();
    setIsScanning(false);
    setIsConnecting(true);
    console.log('trying to connect to: ', device?.id);

    try {
      const connectedDevice = await blePlxManager.connectToDevice(device?.id);

      console.log('discovering all services for: ', connectedDevice?.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();

      if (isFirstConnection) {
        console.log('storing default device');
        await AsyncStorage.setItem('@currentDevice', JSON.stringify(device));
      }

      console.log('succesfully connected to device: ', device?.id);
      setConnectedPeripheral(device);
      setStoragePeripheral(device);
      setIsConnecting(false);
    } catch (error) {
      console.log('errror on connecting to device: ', error);
      setIsConnecting(false);
    }
  };

  const onSelectPeripheral = async (device) => {
    await connectToPeripheral(device);

    console.log('starting notifications for device: ', device?.id);
    await sleep(500);
    await startNotifications(device);
    await sleep(500);
    await writeCommands(device);
  };

  const startScan = () => {
    setIsScanning(true);
    console.log('is scanning');

    blePlxManager.startDeviceScan(
      [glucoseServiceUUID],
      null,
      handleDiscoverPeripheral
    );
  };

  useEffect(() => {
    if (discoveredPeripheral) {
      const peripheral = discoveredPeripherals.find(
        (item) => item?.id === discoveredPeripheral?.id
      );

      if (!peripheral)
        setDiscoveredPeripherals((prev) => [...prev, discoveredPeripheral]);
    }
  }, [discoveredPeripheral]);

  const handleDiscoverPeripheral = (error, scannedDevice) => {
    if (error) {
      console.log('BoardManager: Failed to Scan: ', error);
      setIsScanning(false);
      return;
    }

    setDiscoveredPeripheral({
      name: scannedDevice.name,
      id: scannedDevice.id,
      rssi: scannedDevice.rssi,
    });
  };

  const handleUpdateValueForCharacteristic = (data) => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value
    );

    if (data?.characteristic === gmCharacteristicUUID) {
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
