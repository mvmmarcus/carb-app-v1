/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState('disconnected');

  const startScan = () => {
    BleManager.scan([], 3, true)
      .then(results => {
        console.log('Scanning...');
        setIsScanning(true);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = data => {
    // let peripheral = peripherals.get(data.peripheral);
    // if (peripheral) {
    //   peripheral.connected = false;
    //   peripherals.set(peripheral.id, peripheral);
    //   setList(Array.from(peripherals.values()));
    // }

    setDeviceStatus('disconnected');
    console.log('Disconnected from ' + data.peripheral);
  };

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
      if (results.length == 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        // var peripheral = results[i];
        // peripheral.connected = true;
        // peripherals.set(peripheral.id, peripheral);
        // setList(Array.from(peripherals.values()));
      }
    });
  };

  const handleDiscoverPeripheral = peripheral => {
    // console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    if (deviceStatus === 'fail' || deviceStatus === 'disconnected') {
      setList(Array.from(peripherals.values()));
    }
  };

  useEffect(() => {
    console.log('deviceStatus: ', deviceStatus);
  }, [deviceStatus]);

  useEffect(() => {
    setInterval(() => {
      if (deviceStatus === 'fail' || deviceStatus === 'disconnected') {
        startScan();
      }
    }, 4000);
  }, [deviceStatus]);

  useEffect(() => {
    const connectItem = list?.find(item => item?.id === '78:04:73:C7:55:7D');

    if (connectItem) {
      console.log('connectItem id: ', connectItem?.id);

      setTimeout(() => {
        testPeripheral(connectItem);
      }, 500);
    }
  }, [list]);

  const testPeripheral = peripheral => {
    setDeviceStatus('pending');

    BleManager.createBond(peripheral.id)
      .then(() => {
        console.log('success to create bond');

        BleManager.connect(peripheral.id)
          .then(() => {
            setDeviceStatus('connected');

            console.log('Connected to ' + peripheral.id);

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then(
                peripheralData => {
                  console.log('peripheralData', peripheralData);

                  const glucoseService = '00001808-0000-1000-8000-00805f9b34fb';
                  const racpCharacteristic =
                    '00002a52-0000-1000-8000-00805f9b34fb';
                  const gmCharacteristic =
                    '00002a18-0000-1000-8000-00805f9b34fb';
                  const gmcCharacteristic =
                    '00002a34-0000-1000-8000-00805f9b34fb';

                  setTimeout(() => {
                    BleManager.startNotification(
                      peripheral.id,
                      glucoseService,
                      gmCharacteristic,
                    )
                      .then(() => {
                        console.log(
                          'Started notification on ' + gmCharacteristic,
                        );

                        setTimeout(() => {
                          BleManager.startNotification(
                            peripheral.id,
                            glucoseService,
                            gmcCharacteristic,
                          )
                            .then(() => {
                              console.log(
                                'Started notification on ' + gmcCharacteristic,
                              );

                              setTimeout(() => {
                                BleManager.startNotification(
                                  peripheral.id,
                                  glucoseService,
                                  racpCharacteristic,
                                ).then(() => {
                                  console.log(
                                    'Started notification on ' +
                                      racpCharacteristic,
                                  );

                                  setTimeout(() => {
                                    BleManager.write(
                                      peripheral.id,
                                      glucoseService,
                                      racpCharacteristic,
                                      [0x01, 0x06],
                                    ).then(() => {
                                      console.log('Writed RACP success');

                                      setTimeout(() => {
                                        BleManager.startNotification(
                                          peripheral.id,
                                          glucoseService,
                                          gmCharacteristic,
                                        ).then(() => {
                                          console.log(
                                            'Started notification on ' +
                                              gmCharacteristic,
                                          );
                                        });
                                      });
                                    });
                                  }, 200);
                                });
                              }, 200);
                            })
                            .catch(err => {
                              console.log('Notification error', err);
                            });
                        }, 200);
                      })
                      .catch(error => {
                        console.log('Notification error', error);
                      });
                  }, 200);
                },
              );
            }, 1000);
          })
          .catch(error => {
            console.log('Connection error', error);
          });
      })
      .catch(err => {
        setDeviceStatus('fail');

        console.log('err on createBond: ', err);
      });
  };

  useEffect(() => {
    BleManager.start({showAlert: false});

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
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
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
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    return () => {
      console.log('unmount');

      bleManagerEmitter.removeListener(
        'BleManagerConnectPeripheral',
        args => {},
      );

      bleManagerEmitter.removeListener('BleManagerDidUpdateState', args => {});

      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
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

  const renderItem = item => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => testPeripheral(item)}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333333',
              padding: 10,
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
            }}>
            RSSI: {item.rssi}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: 'center',
              color: '#333333',
              padding: 2,
              paddingBottom: 20,
            }}>
            {item.id}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={{margin: 10}}>
              <Button
                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan()}
              />
            </View>

            <View style={{margin: 10}}>
              <Button
                title="Retrieve connected peripherals"
                onPress={() => retrieveConnected()}
              />
            </View>

            {list.length == 0 && (
              <View style={{flex: 1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <FlatList
          data={list}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React, {useEffect, useState} from 'react';
// import {
//   NativeModules,
//   NativeEventEmitter,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   Button,
//   View,
//   Platform,
//   PermissionsAndroid,
//   FlatList,
//   TouchableHighlight,
// } from 'react-native';

// import BleManager from 'react-native-ble-manager';
// const BleManagerModule = NativeModules.BleManager;
// import {bytesToString, stringToBytes} from 'convert-string';
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const base64 = require('base64-js');

// import {Buffer} from 'buffer';

// import {Colors} from 'react-native/Libraries/NewAppScreen';

// const App = () => {
//   const [isScanning, setIsScanning] = useState(false);
//   const peripherals = new Map();
//   const [list, setList] = useState([]);

//   const [peripheralId, setPeripheralId] = useState('');

//   // start to scan peripherals
//   const startScan = () => {
//     // skip if scan process is currenly happening
//     if (isScanning) {
//       return;
//     }

//     // first, clear existing peripherals
//     peripherals.clear();
//     setList(Array.from(peripherals.values()));

//     // then re-scan it
//     BleManager.scan([], 3, true)
//       .then(() => {
//         console.log('Scanning...');
//         setIsScanning(true);
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   };

//   // handle discovered peripheral
//   const handleDiscoverPeripheral = peripheral => {
//     console.log('Got ble peripheral', peripheral);

//     if (!peripheral.name) {
//       peripheral.name = 'NO NAME';
//     }

//     peripherals.set(peripheral.id, peripheral);
//     setList(Array.from(peripherals.values()));
//   };

//   // handle stop scan event
//   const handleStopScan = () => {
//     console.log('Scan is stopped');
//     setIsScanning(false);
//   };

//   const updatePeripheral = (peripheral, callback) => {
//     let p = peripherals.get(peripheral.id);
//     if (!p) {
//       return;
//     }

//     p = callback(p);
//     peripherals.set(peripheral.id, p);
//     setList(Array.from(peripherals.values()));
//   };

//   // get advertised peripheral local name (if exists). default to peripheral name
//   const getPeripheralName = item => {
//     if (item.advertising) {
//       if (item.advertising.localName) {
//         return item.advertising.localName;
//       }
//     }

//     return item.name;
//   };

//   const writeRequest = async (
//     deviceId,
//     serviceUUID,
//     charasteristicUUID,
//     command,
//   ) => {
//     console.log(
//       `Write value: ${command}, to characteristic: ${charasteristicUUID}`,
//     );

//     const data = stringToBytes(command);
//     console.log('data: ', data);

//     const valueToWrite = new Buffer(command);
//     console.log('valueToWrite: ', valueToWrite);

//     // const data = fromByteArray(byteArray);
//     // console.log("data: ", data)

//     const myData = [0x01, 0x01];
//     const dataToWrite = base64.fromByteArray(myData);
//     console.log('dataToWrite: ', dataToWrite);

//     return await BleManager.write(
//       deviceId,
//       serviceUUID,
//       charasteristicUUID,
//       data,
//     )
//       .then(res => {
//         console.log(
//           `Write characteristic: ${charasteristicUUID} Response: `,
//           res,
//         );
//       })
//       .catch(error => {
//         console.log(
//           `Write characteristic: ${charasteristicUUID} Error: `,
//           error,
//         );
//       });
//   };

//   const readCharacteristic = async (
//     deviceId,
//     serviceUUID,
//     charasteristicUUID,
//   ) => {
//     await BleManager.read(deviceId, serviceUUID, charasteristicUUID)
//       .then(res => {
//         console.log(
//           `Read characteristic: ${charasteristicUUID} response: `,
//           res,
//         ); // [229, 7, 7, 27, 12, 19, 0]
//         if (charasteristicUUID.includes('2a08')) {
//           const newBuffer = Buffer.from(res);
//           console.log('myBuffer: ', newBuffer);
//           const year = newBuffer.readUInt16LE(0);
//           const month = newBuffer.readUInt8(2);
//           const day = newBuffer.readUInt8(3);
//           const hours = newBuffer.readUInt8(4);
//           const minutes = newBuffer.readUInt8(5);
//           const seconds = newBuffer.readUInt8(6);

//           console.log(
//             `data completa: ${day}/0${month}/${year} às ${hours}:${minutes}:${seconds}`,
//           );
//         }
//       })
//       .catch(error => {
//         console.log('read err', error);
//       });
//   };

//   // connect to peripheral then test the communication
//   const connectAndTestPeripheral = async peripheral => {
//     console.log('Trying to connect to peripheral: ', peripheral.name);

//     if (!peripheral) {
//       return;
//     }

//     if (peripheral.connected) {
//       BleManager.disconnect(peripheral.id);
//       return;
//     }

//     // connect to selected peripheral

//     try {
//       await BleManager.connect(peripheral.id).then(() =>
//         console.log('Success to connect to: ', peripheral),
//       );
//       await BleManager.retrieveServices(peripheral.id).then(
//         services => console.log('services: ', services),
//         setPeripheralId(peripheral.id),
//       );
//       await BleManager.startNotification(peripheral.id, '1808', '2a18')
//         .then(() => console.log('Notification from 2a18 started'))
//         .then(async () => {
//           await BleManager.startNotification(
//             peripheral.id,
//             '1808',
//             '2a52',
//           ).then(() => console.log('Notification from 2a52 started'));
//         });

//       bleManagerEmitter.addListener(
//         'BleManagerDidUpdateValueForCharacteristic',
//         ({value, peripheral, characteristic, service}) => {
//           // Convert bytes array to string
//           console.log('received value: ', value);
//           const data = bytesToString(value);
//           console.log(`Recieved ${data} for characteristic ${characteristic}`);
//         },
//       );
//     } catch (error) {
//       console.log('error: ', error);
//     }
//   };

//   // mount and onmount event handler
//   useEffect(() => {
//     console.log('Mount');

//     // initialize BLE modules
//     BleManager.start({showAlert: false}).then(() =>
//       console.log('Successfull Initialization'),
//     );

//     // add ble listeners on mount
//     bleManagerEmitter.addListener(
//       'BleManagerDiscoverPeripheral',
//       handleDiscoverPeripheral,
//     );
//     bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);

//     bleManagerEmitter.addListener('BleManagerDidUpdateState', args => {
//       console.log('######## BleManagerDidUpdateState ########');
//       console.log('args: ', args);
//       console.log('The new state:', args.state);
//     });

//     // check location permission only for android device
//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//       PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ).then(r1 => {
//         if (r1) {
//           console.log('Permission is OK');
//           return;
//         }

//         PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         ).then(r2 => {
//           if (r2) {
//             console.log('User accept');
//             return;
//           }

//           console.log('User refuse');
//         });
//       });
//     }

//     // remove ble listeners on unmount
//     return () => {
//       console.log('Unmount');

//       bleManagerEmitter.removeListener(
//         'BleManagerDiscoverPeripheral',
//         handleDiscoverPeripheral,
//       );
//       bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);

//       bleManagerEmitter.removeListener(
//         'BleManagerDidUpdateValueForCharacteristic',
//         () => {},
//       );

//       bleManagerEmitter.removeListener('BleManagerDidUpdateState', args => {});
//     };
//   }, []);

//   // render list of devices
//   const renderItem = item => {
//     if (item?.name !== 'NO NAME') {
//       console.log({item});
//     }

//     const color = item.connected ? 'green' : '#fff';
//     return (
//       <TouchableHighlight onPress={() => connectAndTestPeripheral(item)}>
//         <View style={[styles.row, {backgroundColor: color}]}>
//           <Text
//             style={{
//               fontSize: 12,
//               textAlign: 'center',
//               color: '#333333',
//               padding: 10,
//             }}>
//             {getPeripheralName(item)}
//           </Text>
//           <Text
//             style={{
//               fontSize: 10,
//               textAlign: 'center',
//               color: '#333333',
//               padding: 2,
//             }}>
//             RSSI: {item.rssi}
//           </Text>
//           <Text
//             style={{
//               fontSize: 8,
//               textAlign: 'center',
//               color: '#333333',
//               padding: 2,
//               paddingBottom: 20,
//             }}>
//             {item.id}
//           </Text>
//         </View>
//       </TouchableHighlight>
//     );
//   };

//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={styles.safeAreaView}>
//         {/* header */}
//         <View style={styles.body}>
//           <View style={styles.scanButton}>
//             <Button
//               title={'Scan Bluetooth Devices'}
//               onPress={() => startScan()}
//             />
//           </View>

//           {list.length === 0 && (
//             <View style={styles.noPeripherals}>
//               <Text style={styles.noPeripheralsText}>No peripherals</Text>
//             </View>
//           )}
//         </View>

//         {/* ble devices */}
//         <FlatList
//           data={list}
//           renderItem={({item}) => renderItem(item)}
//           keyExtractor={item => item.id}
//         />

//         {/* bottom footer */}
//         <View style={styles.footer}>
//           <TouchableHighlight
//             onPress={() => readCharacteristic(peripheralId, '1808', '2a51')}>
//             <View style={[styles.row, styles.footerButton]}>
//               <Text>Read G. Feature</Text>
//             </View>
//           </TouchableHighlight>
//           <TouchableHighlight
//             onPress={() => readCharacteristic(peripheralId, '1808', '2a08')}>
//             <View style={[styles.row, styles.footerButton]}>
//               <Text>Read Date</Text>
//             </View>
//           </TouchableHighlight>
//         </View>

//         <View>
//           <TouchableHighlight
//             onPress={() =>
//               writeRequest(peripheralId, '1808', '2a52', '0x0101')
//             }>
//             <View style={[styles.row, styles.footerButton]}>
//               <Text>Write R. A. Control Point</Text>
//             </View>
//           </TouchableHighlight>
//         </View>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   safeAreaView: {
//     flex: 1,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   scanButton: {
//     margin: 10,
//   },
//   noPeripherals: {
//     flex: 1,
//     margin: 20,
//   },
//   noPeripheralsText: {
//     textAlign: 'center',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginBottom: 30,
//   },
//   footerButton: {
//     alignSelf: 'stretch',
//     padding: 10,
//     backgroundColor: 'grey',
//   },
// });

// export default App;
