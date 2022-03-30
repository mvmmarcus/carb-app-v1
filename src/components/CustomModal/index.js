import React from 'react';

import { Modal, Portal } from 'react-native-paper';

const CustomModal = ({ children, ...props }) => {
  return (
    <Portal>
      <Modal {...props}>{children}</Modal>
    </Portal>
  );
};

export default CustomModal;
