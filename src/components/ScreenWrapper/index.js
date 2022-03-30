import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';

import Alert from '../Alert';
import BluetoothContext from '../../contexts/bluetooth';

import { theme } from '../../styles/theme';
import { getStyle } from './styles';

const ScreenWrapper = ({ children, isLoading = false, style = {} }) => {
  const styles = getStyle({});
  const { $primary, $secondary } = theme;

  const { isGettingBloodGlucoses } = useContext(BluetoothContext);

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      {isGettingBloodGlucoses && <Alert message="Atualizando registros" />}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {isLoading ? (
          <ActivityIndicator size={80} color={$secondary} />
        ) : (
          <View style={{ ...styles.container, ...style }}>{children}</View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default ScreenWrapper;
