import React from 'react';
import { View, Dimensions } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import LogoSvg from '../../../assets/full_logo.svg';

import { theme } from '../../styles/theme';
import { getStyle } from './styles';

const SplashScreen = () => {
  const { width, height } = Dimensions.get('screen');
  const { $secondary } = theme;
  const styles = getStyle({ width, height });

  return (
    <View style={styles.container}>
      <LogoSvg />
      <ActivityIndicator
        style={styles.loadingIcon}
        color={$secondary}
        size={40}
      />
    </View>
  );
};

export default SplashScreen;
