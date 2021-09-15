/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import {Container} from './styles';

const glucoseService = '00001808-0000-1000-8000-00805f9b34fb';
const racpCharacteristic = '00002a52-0000-1000-8000-00805f9b34fb';
const gmCharacteristic = '00002a18-0000-1000-8000-00805f9b34fb';
const gmcCharacteristic = '00002a34-0000-1000-8000-00805f9b34fb';

const HomePage = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [list, setList] = useState([]);
  const peripherals = new Map();

  const [connectedPeripheral, setConnectedPeripheral] = useState(null);

  useEffect(() => {
    (async () => {
      await BleManager.start({showAlert: false});

      bleManagerEmitter.addListener('BleManagerConnectPeripheral', args => {
        console.log('######## BleManagerConnectPeripheral ########');
        console.log('args: ', args);
      });

      bleManagerEmitter.addListener('BleManagerDidUpdateState', args => {
        console.log('######## BleManagerDidUpdateState ########');
        console.log('args: ', args);
        console.log('The new state:', args.state);
      });

      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );

      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );

      if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then(result => {
          if (result) {
            console.log('Permission is OK');
          } else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(response => {
              if (response) {
                console.log('User accept');
              } else {
                console.log('User refuse');
              }
            });
          }
        });
      }

      setInterval(() => {
        (async () => {
          const defaultDevice = await AsyncStorage.getItem('@defaultDevice');
          const parsedDefaultDevice = JSON.parse(defaultDevice);

          const isConnected = await BleManager.isPeripheralConnected(
            parsedDefaultDevice?.id,
            [glucoseService],
          );

          if (!isConnected) {
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
        args => {},
      );

      bleManagerEmitter.removeListener('BleManagerDidUpdateState', args => {});

      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );

      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );
    };
  }, []);

  function handleDisconnectedPeripheral(data) {
    let peripheral = data.peripheral;
    console.log(
      'BoardManager: Disconnected from: ',
      JSON.stringify(peripheral),
    );
    setConnectedPeripheral(null);
  }

  const _sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const sleep = async ms => {
    await _sleep(ms);
  };

  async function startScan() {
    try {
      setIsScanning(true);
      await BleManager.scan([glucoseService], 3, true);
    } catch (error) {
      console.log('BoardManager: Failed to Scan: ', error);
    }
  }

  async function onSelectPeripheral(peripheral) {
    if (peripheral) {
      console.log('onSelectPeripheral ', JSON.stringify(peripheral));

      const isConnected = await BleManager.isPeripheralConnected(
        peripheral.id,
        [glucoseService],
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

  const handleUpdateValueForCharacteristic = data => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  };

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length === 0) {
        console.log('No connected peripherals');
      }
      console.log('results: ', results);
    });
  };

  const handleDiscoverPeripheral = async peripheral => {
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
      if (connectedPeripheral !== null) {
        await connectToPeripheral(connectedPeripheral);
      }
    })();
  }, [connectedPeripheral?.id]);

  useEffect(() => {
    console.log('connectedPeripheral: ', connectedPeripheral);
  }, [connectedPeripheral?.id]);

  async function connectToPeripheral(peripheral) {
    setIsConnecting(true);

    try {
      const isConnected = await BleManager.isPeripheralConnected(
        peripheral.id,
        [glucoseService],
      );

      console.log('connectToPeripheral => isConnected: ', isConnected);

      if (!isConnected) {
        console.log('BLE: Connecting to device: ' + peripheral.id);

        await BleManager.connect(peripheral.id).then(() =>
          setIsScanning(false),
        );

        await AsyncStorage.setItem(
          '@defaultDevice',
          JSON.stringify(peripheral),
        );

        await sleep(1000);

        console.log('BLE: Retreiving services');
        await BleManager.retrieveServices(peripheral.id);

        await sleep(1000);
        console.log('Started notification on: ', gmCharacteristic);
        await BleManager.startNotification(
          peripheral.id,
          glucoseService,
          gmCharacteristic,
        );

        await sleep(1000);
        console.log('Started notification on: ', gmcCharacteristic);
        await BleManager.startNotification(
          peripheral.id,
          glucoseService,
          gmcCharacteristic,
        );

        await sleep(1000);
        console.log('Started notification on: ', racpCharacteristic);
        await BleManager.startNotification(
          peripheral.id,
          glucoseService,
          racpCharacteristic,
        );

        await sleep(1000);
        console.log('Started writing on: ', racpCharacteristic);
        await BleManager.write(
          peripheral.id,
          glucoseService,
          racpCharacteristic,
          [0x01, 0x06],
        );

        await sleep(1000);
        console.log('Started notification on: ', racpCharacteristic);
        await BleManager.startNotification(
          peripheral.id,
          glucoseService,
          racpCharacteristic,
        );

        setIsConnecting(false);
      }
    } catch (error) {
      console.log('BLE: Error connecting: ', error);

      setIsConnecting(false);
    }
  }

  const renderItem = item => {
    return (
      <TouchableHighlight onPress={() => onSelectPeripheral(item)}>
        <View>
          <Text>{item?.name}</Text>
          <Text>RSSI: {item.rssi}</Text>
          <Text>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <Container>
      <SafeAreaView>
        <View>
          {isScanning ? (
            <Text>Scanning...</Text>
          ) : (
            isConnecting && <Text>Connecting...</Text>
          )}

          {list?.values()?.length === 0 && (
            <View>
              <Text>No peripherals</Text>
            </View>
          )}
        </View>

        <FlatList
          data={list}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </Container>
  );
};

export default HomePage;
