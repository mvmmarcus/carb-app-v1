import React, { createContext, useState, useEffect } from 'react';

import AsyncStorage from '@react-native-community/async-storage';

const BluetoothContext = createContext({
  isEnabled: false,
  isGettingRecords: false,
  records: [],
  setRecords: () => {},
  setIsGettingRecords: () => {},
  setIsEnabled: () => {},
});

export const BluetoothProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isGettingRecords, setIsGettingRecords] = useState(false);
  const [records, setRecords] = useState([]);

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

  return (
    <BluetoothContext.Provider
      value={{
        isEnabled,
        isGettingRecords,
        records,
        setRecords,
        setIsGettingRecords,
        setIsEnabled,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothContext;
