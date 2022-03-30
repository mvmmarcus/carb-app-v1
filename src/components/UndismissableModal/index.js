import React, { useContext } from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import BluetoothContext from '../../contexts/bluetooth';
import CustomModal from '../../components/CustomModal';
import CustomText from '../../components/CustomText';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const UndismissableModal = () => {
  const styles = getStyle({});
  const { $secondary } = theme;
  const { isConnecting } = useContext(BluetoothContext);

  return (
    <CustomModal
      modalOptions={{
        visible: isConnecting,
        dismissable: false,
        style: styles.container,
      }}
    >
      <View style={styles.infoBox}>
        <CustomText weight="bold" style={styles.title}>
          Conectando ao seu dispositivo
        </CustomText>
        <CustomText style={styles.subtitle}>
          Certifique-se que o dispositivo esteja próximo e no modo de pareamento
        </CustomText>
        <ActivityIndicator animating={true} color={$secondary} />
      </View>
    </CustomModal>
  );
};

export default React.memo(UndismissableModal);
