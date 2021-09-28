import React, { useContext } from 'react';

import { ActivityIndicator } from 'react-native-paper';

import BluetoothContext from '../../contexts/bluetooth';
import CustomModal from '../CustomModal';

import { ContentModal, TitleModal, WrapperModal, Description } from './styles';

const UndismissableModal = () => {
  const { isConnecting, isFirstConnection } = useContext(BluetoothContext);

  return (
    <CustomModal
      modalOptions={{
        visible: isConnecting && !isFirstConnection,
        dismissable: false,
      }}
    >
      <WrapperModal>
        <TitleModal>
          Estamos conectando você{'\n'}
          ao seu dispositivo
        </TitleModal>
        <ContentModal>
          <Description>Por favor, aguarde.</Description>
          <ActivityIndicator animating={true} />
        </ContentModal>
      </WrapperModal>
    </CustomModal>
  );
};

export default UndismissableModal;
