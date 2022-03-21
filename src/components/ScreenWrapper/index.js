import React from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { theme } from '#/styles/theme';
import { getStyle } from './styles';

const ScreenWrapper = ({ children }) => {
  const styles = getStyle({});
  const { $primary, $secondary } = theme;

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>{children}</View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ScreenWrapper;
