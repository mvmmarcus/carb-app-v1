import React from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import CustomText from '../../components/CustomText';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const Alert = ({ message = '' }) => {
  const styles = getStyle({});
  const { $white } = theme;
  return (
    <View style={styles.infoBox}>
      <CustomText weight="bold" style={styles.title}>
        {message}
      </CustomText>
      <ActivityIndicator animating={true} color={$white} />
    </View>
  );
};

export default Alert;
