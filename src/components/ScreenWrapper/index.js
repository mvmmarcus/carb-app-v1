import React, { useContext, useEffect } from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';

import Alert from '../Alert';
import BluetoothContext from '../../contexts/bluetooth';
import Snackbar from '../../components/Snackbar';
import UserContext from '../../contexts/user';

import { theme } from '../../styles/theme';
import { getStyle } from './styles';

const ScreenWrapper = ({ children, isLoading = false, style = {} }) => {
  const styles = getStyle({});
  const { $primary, $secondary } = theme;
  const { isGettingBloodGlucoses } = useContext(BluetoothContext);
  const { snackMessage, setSnackMessage } = useContext(UserContext);

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      {isGettingBloodGlucoses && <Alert message="Atualizando registros" />}
      <Snackbar
        message={snackMessage?.message}
        type={snackMessage?.type}
        onDismiss={() => setSnackMessage(null)}
      />
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
