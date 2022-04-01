import React from 'react';
import { Dimensions } from 'react-native';

import { Snackbar as PaperSnacknar } from 'react-native-paper';

import CustomText from '../CustomText';

import { styles } from './styles';

const Snackbar = ({
  type = 'default',
  message = '',
  duration = 1500,
  textColor = 'white',
  isTop = true,
  style = {},
  onDismiss = () => null,
}) => {
  const { width } = Dimensions.get('screen');

  const wrapperStyles = isTop ? { top: 40 } : { bottom: 0 };

  const stylesByType = {
    error: 'errorContainer',
    success: 'successContainer',
    default: 'defaultContainer',
  };

  return (
    <PaperSnacknar
      theme={{ colors: { accent: textColor } }}
      wrapperStyle={{
        ...wrapperStyles,
        width: width,
      }}
      duration={duration}
      style={{ ...styles[stylesByType[type]], ...style }}
      visible={!!message}
      onDismiss={onDismiss}
      action={{
        label: '',
      }}
    >
      <CustomText style={{ ...styles.text, color: textColor }}>
        {message}
      </CustomText>
    </PaperSnacknar>
  );
};

export default Snackbar;
