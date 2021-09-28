import React from 'react';

import { Modal, Portal } from 'react-native-paper';

const CustomModal = ({ children, modalOptions }) => {
  return (
    <Portal>
      <Modal {...modalOptions}>{children}</Modal>
    </Portal>
  );
};

export default CustomModal;
