/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';

import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

import useAuth from '../hooks/useAuth';
import AuthContext from '../contexts/auth';
import { jsonParse } from '../utils/jsonParse';
import {
  glucoseService,
  gmcCharacteristic,
  gmCharacteristic,
  racpCharacteristic,
} from '../utils/glucoseServices';

const BluetoothContext = createContext({
  bluetoothState: 'PoweredOff',
  isGettingBloodGlucoses: false,
  isAcceptedPermissions: false,
  isConnecting: false,
  bloodGlucoses: [],
  scanStatus: 'start',
  storagePeripheral: null,
  connectedPeripheral: null,
  discoveredPeripherals: [],
  setBloodGlucoses: () => {},
  setScanStatus: () => {},
  setIsAcceptedPermissions: () => {},
  setBluetoothState: () => {},
  onSelectPeripheral: () => {},
});

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothProvider = ({ children }) => {
  const [scanStatus, setScanStatus] = useState('start');
  const [isConnecting, setIsConnecting] = useState(false);
  const [bluetoothState, setBluetoothState] = useState('PoweredOff');
  const [isAcceptedPermissions, setIsAcceptedPermissions] = useState(false);
  const [isGettingBloodGlucoses, setIsGettingBloodGlucoses] = useState(false);
  const [bloodGlucoses, setBloodGlucoses] = useState([]);
  const [connectedPeripheral, setConnectedPeripheral] = useState(null);
  const [storagePeripheral, setStoragePeripheral] = useState(null);
  const [discoveredPeripherals, setDiscoveredPeripherals] = useState([]);
  const [discoveredPeripheral, setDiscoveredPeripheral] = useState(null);
  const [isResetListeners, setIsResetListeners] = useState(false);
  const { user } = useAuth();

  let newBloodGlucoses = [];
  let currentDiscoveredPeripheral = null;
  let disconnectScanToggle = false;

  useEffect(() => {
    (async () => {
      if (isAcceptedPermissions && bluetoothState === 'PoweredOn') {
        await BleManager.start({ showAlert: false });
        await sleep(500);

        const userInfosByUid = jsonParse(
          await AsyncStorage.getItem(`@carbs:${user?.uid}`)
        );
        const defaultPeripheral = userInfosByUid?.defaultPeripheral;

        if (defaultPeripheral) {
          setStoragePeripheral(defaultPeripheral);
        }
      }
    })();
  }, [isAcceptedPermissions, bluetoothState]);

  useEffect(() => {
    // Observador disparado ao encontrar um dispositivo novo compatível com o serviço escaneado
    const discoverPeripheralSubscription = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral
    );

    // Observador disparado ao perder a conexão com o dispositivo conectado atual
    const disconnectPeripheralSubscription = bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral
    );

    // Observador disparado ao receber uma notificação de alguma caracteristica do servidor
    const didUpdateValueForCharacteristicSubscription =
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        (data) => handleUpdateValueForCharacteristic(data, bloodGlucoses)
      );

    // Observador disparado ao encerrar a varredura por novos dispositivos
    const stopScanSubscripttion = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan
    );

    return () => {
      discoverPeripheralSubscription?.remove();
      disconnectPeripheralSubscription?.remove();
      didUpdateValueForCharacteristicSubscription?.remove();
      stopScanSubscripttion?.remove();
    };
  }, [isResetListeners]);

  useEffect(() => {
    // console.log('scanStatus: ', scanStatus);

    (async () => {
      if (
        isAcceptedPermissions &&
        bluetoothState === 'PoweredOn' &&
        scanStatus === 'start' &&
        !connectedPeripheral
      ) {
        await startScan();
      }
    })();
  }, [isAcceptedPermissions, bluetoothState, scanStatus, connectedPeripheral]);

  useEffect(() => {
    // console.log('bluetoothState: ', bluetoothState);

    if (bluetoothState === 'PoweredOff') {
      setDiscoveredPeripherals([]);
      setDiscoveredPeripheral(null);
    }

    setIsResetListeners((prev) => !prev);
  }, [bluetoothState]);

  useEffect(() => {
    if (discoveredPeripheral) {
      (async () => {
        const discoveredDevices = await BleManager.getDiscoveredPeripherals();
        //  console.log('discovered pheriferals: ', discoveredDevices);

        setDiscoveredPeripherals(discoveredDevices);
      })();
    }
  }, [discoveredPeripheral?.id]);

  useEffect(() => {
    (async () => {
      if (
        storagePeripheral &&
        storagePeripheral?.id === discoveredPeripheral?.id &&
        !connectedPeripheral &&
        !isGettingBloodGlucoses &&
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
    // console.log('Started notification on: ', gmCharacteristic);
    await sleep(500);

    await BleManager.startNotification(
      peripheral?.id,
      glucoseService,
      gmcCharacteristic
    );
    // console.log('Started notification on: ', gmcCharacteristic);
    await sleep(500);

    await BleManager.startNotification(
      peripheral?.id,
      glucoseService,
      racpCharacteristic
    );
    // console.log('Started notification on: ', racpCharacteristic);
  };

  const writeCommands = async (peripheral) => {
    await BleManager.write(
      peripheral?.id,
      glucoseService,
      racpCharacteristic,
      [0x01, 0x01]
    );

    if (storagePeripheral?.id !== peripheral?.id) {
      const userInfosByUid = jsonParse(
        await AsyncStorage.getItem(`@carbs:${user?.uid}`)
      );

      await AsyncStorage.setItem(
        `@carbs:${user?.uid}`,
        JSON.stringify({
          ...userInfosByUid,
          defaultPeripheral: peripheral,
        })
      );

      setStoragePeripheral(peripheral);
    }

    setConnectedPeripheral(peripheral);
    setIsConnecting(false);
    setIsGettingBloodGlucoses(true);
  };

  const connectToPeripheral = async (peripheral) => {
    // console.log('BLE: Connecting to device: ' + peripheral.id);
    await BleManager.stopScan();
    await sleep(500);

    await BleManager.connect(peripheral.id);
    await sleep(500);

    await BleManager.retrieveServices(peripheral.id);
  };

  const onSelectPeripheral = useCallback(async (peripheral) => {
    try {
      setIsConnecting(true);

      await connectToPeripheral(peripheral);
      await sleep(500);

      await startNotifications(peripheral);
      await sleep(500);

      await writeCommands(peripheral);
    } catch (error) {
      setIsConnecting(false);
      setScanStatus('start');
      // console.log('onSelectPeripheral error: ', error);
    }
  }, []);

  const startScan = async () => {
    try {
      await BleManager.scan([glucoseService], 0, false);
      setScanStatus('scanning');
    } catch (error) {
      setScanStatus('error');
      // console.log('BoardManager: Failed to Scan: ', error);
    }
  };

  const handleDiscoverPeripheral = (peripheral) => {
    if (peripheral?.id !== currentDiscoveredPeripheral?.id) {
      currentDiscoveredPeripheral = peripheral;
      setDiscoveredPeripheral(peripheral);
    }
  };

  const handleUpdateValueForCharacteristic = async (data) => {
    if (data?.characteristic === racpCharacteristic) {
      // console.log('@@@@@@@@@@@@@@@ all data received @@@@@@@@@@@@@@');

      const bloodGlucoseAlreadyExists = (
        bloodGlucose = null,
        bloodGlucoses = []
      ) => {
        return !!bloodGlucoses?.find(
          (item) => item?.fullDate === bloodGlucose?.fullDate
        );
      };

      const updatedNewBloodGlucoses = [];

      const userInfosByUid = jsonParse(
        await AsyncStorage.getItem(`@carbs:${user?.uid}`)
      );

      const currentBloodGlucoses = userInfosByUid?.bloodGlucoses;

      if (currentBloodGlucoses?.length > 0) {
        newBloodGlucoses?.forEach((item) => {
          if (!bloodGlucoseAlreadyExists(item, currentBloodGlucoses)) {
            updatedNewBloodGlucoses?.push(item);
          }
        });

        await AsyncStorage.setItem(
          `@carbs:${user?.uid}`,
          JSON.stringify({
            ...userInfosByUid,
            bloodGlucoses: [
              ...currentBloodGlucoses,
              ...updatedNewBloodGlucoses,
            ],
          })
        );

        setBloodGlucoses([...currentBloodGlucoses, ...updatedNewBloodGlucoses]);
      } else {
        await AsyncStorage.setItem(
          `@carbs:${user?.uid}`,
          JSON.stringify({
            ...userInfosByUid,
            bloodGlucoses: newBloodGlucoses,
          })
        );

        setBloodGlucoses(newBloodGlucoses);
      }
      await sleep(500); // Garantir que não trave ao receber muitos dados de uma vez
      setIsGettingBloodGlucoses(false);
    }

    if (data?.characteristic === gmCharacteristic) {
      // Criar um buffer a partir dos dados brutos recebidos pelo servidor no formato de byte array
      const newBuffer = Buffer.from(data.value);

      // Converter valor para string e arredondar para duas casas decimais
      const convertNumberToString = (value) =>
        value?.toString()?.padStart(2, '0');

      // Formatar e extrair os dados de interesse
      const year = newBuffer.readUInt16LE(3);
      const month = data.value[5];
      const day = data.value[6];
      const hours = data.value[7];
      const minutes = data.value[8];
      const seconds = data.value[9];
      const value = data.value[12]; // Valor da glicemia
      const date = `${year}/${convertNumberToString(
        month
      )}/${convertNumberToString(day)}`;
      const time = `${convertNumberToString(hours)}:${convertNumberToString(
        minutes
      )}:${convertNumberToString(seconds)}`;

      // Objeto reunindo todas as informações coletadas
      const currentBloodGlucose = {
        value,
        date,
        time,
        fullDate: `${date} ${time}`,
        isFromMeter: true,
        id: uuid.v4(),
      };

      // Junção de todos os registros em um array de objetos (valor e data do registro da glicemia no dispositivo)
      newBloodGlucoses = [...newBloodGlucoses, currentBloodGlucose];
    }
  };

  const handleDisconnectedPeripheral = (data) => {
    const peripheral = data?.peripheral;

    //  console.log(
    //   'BoardManager: Disconnected from: ',
    //   JSON.stringify(peripheral)
    // );

    setIsGettingBloodGlucoses(false);
    setIsConnecting(false);
    setDiscoveredPeripheral(null);
    setDiscoveredPeripherals([]);
    setConnectedPeripheral(null);

    // This condition is necessary because BleManagerDisconnectPeripheral event is called twice times
    if (!disconnectScanToggle) {
      setIsResetListeners((prev) => !prev);

      setScanStatus('start');
      disconnectScanToggle = true;
    } else {
      disconnectScanToggle = false;
    }

    currentDiscoveredPeripheral = null;
    newBloodGlucoses = [];
  };

  const handleStopScan = () => {
    // console.log('handleStopScan');
  };

  return (
    <BluetoothContext.Provider
      value={{
        bluetoothState,
        isGettingBloodGlucoses,
        bloodGlucoses,
        scanStatus,
        isConnecting,
        connectedPeripheral,
        storagePeripheral,
        discoveredPeripherals,
        isAcceptedPermissions,
        setBloodGlucoses,
        setScanStatus,
        setIsAcceptedPermissions,
        onSelectPeripheral,
        setBluetoothState,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothContext;
