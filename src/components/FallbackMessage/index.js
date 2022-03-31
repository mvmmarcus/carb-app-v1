import React from 'react';
import { View } from 'react-native';

import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomText from '../CustomText';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const FallbackMessage = ({
  icon = { name: '', size: 80 },
  customIcon,
  title,
  subtitle,
  style = {},
}) => {
  const styles = getStyle({});
  const { $secondary } = theme;

  return (
    <View style={{ ...styles.fallbackContainer, ...style }}>
      {!!customIcon && customIcon}
      {!!icon?.name && (
        <IconMC name={icon?.name} size={icon?.size} color={$secondary} />
      )}
      {!!title && (
        <CustomText weight="bold" style={styles.fallbackTitle}>
          {title}
        </CustomText>
      )}
      {!!subtitle && (
        <CustomText weight="medium" style={styles.fallbackSubtitle}>
          {subtitle}
        </CustomText>
      )}
    </View>
  );
};

export default FallbackMessage;
