import React from 'react';
import { View } from 'react-native';

import { Button } from 'react-native-paper';

import CustomText from '../CustomText';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const Peripheral = ({
  name = '',
  id = '',
  rssi = '',
  isConnected = false,
  isTouchable = true,
  onConnect,
}) => {
  const styles = getStyle({});
  const { $secondary, $white, $primary } = theme;

  const handleConnect = (peripheral) => {
    console.log('selected peripheral: ', peripheral);
    !!onConnect && onConnect(peripheral);
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isConnected ? 'darkgreen' : $secondary,
      }}
    >
      <View
        style={{
          ...styles.rssiBox,
          backgroundColor: isConnected ? 'green' : $primary,
        }}
      >
        <CustomText weight="medium" style={styles.rssiValue}>
          {rssi}
        </CustomText>
      </View>
      <View style={styles.nameBox}>
        <CustomText weight="bold" style={styles.name}>
          {name}
        </CustomText>
        <CustomText weight="regular" style={styles.id}>
          {id}
        </CustomText>
      </View>

      <Button
        onPress={() => handleConnect({ name, id, rssi })}
        uppercase={false}
        mode="contained"
        style={{
          ...styles.connectButton,
          backgroundColor: isConnected ? 'green' : $primary,
          elevation: isConnected ? 0 : 8,
        }}
        labelStyle={styles.connectButtonLabel}
        contentStyle={styles.connectButtonContent}
        disabled={isConnected ? true : false}
      >
        {isConnected ? 'Conectado' : 'Conectar'}
      </Button>
    </View>
  );
};

export default Peripheral;
