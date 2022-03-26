import React from 'react';

import { FAB } from 'react-native-paper';

import { getStyle } from './styles';

const FloatingButton = ({ onPress }) => {
  const styles = getStyle({});

  return <FAB style={styles.container} icon="plus" onPress={() => onPress()} />;
};

export default FloatingButton;
