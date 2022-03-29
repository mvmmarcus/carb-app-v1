import React, { useContext } from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import BluetoothContext from '../../contexts/bluetooth';
import CustomModal from '../../components/CustomModal';
import CustomText from '../../components/CustomText';

const UndismissableModal = () => {
  const { isConnecting } = useContext(BluetoothContext);

  return (
    <CustomModal
      modalOptions={{
        visible: isConnecting,
        dismissable: false,
      }}
    >
      <View>
        <CustomText>
          Conectando{'\n'}
          ao seu dispositivo
        </CustomText>
        <View>
          <CustomText>Por favor, aguarde.</CustomText>
          <ActivityIndicator animating={true} />
        </View>
      </View>
    </CustomModal>
  );
};

export default React.memo(UndismissableModal);
