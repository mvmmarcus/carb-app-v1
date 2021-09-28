import React from 'react';

import { Snackbar as PaperSnacknar } from 'react-native-paper';

const Snackbar = ({ message }) => {
  const [visible, setVisible] = React.useState(!!message);
  return (
    <PaperSnacknar
      onDismiss={() => setVisible(false)}
      visible={visible}
      duration={2000}
      action={{
        label: 'Ok',
        onPress: () => setVisible(false),
      }}
    >
      {message}
    </PaperSnacknar>
  );
};

export default Snackbar;
