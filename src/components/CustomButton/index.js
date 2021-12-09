import React from 'react';

import { Button } from 'react-native-paper';
import CustomText from '../CustomText';

import { styles } from './styles';

const CustomButtom = ({
  children,
  variant = 'primary',
  uppercase = false,
  ...props
}) => {
  const modes = {
    primary: 'contained',
    secondary: 'contained',
    outlined: 'outlined',
  };

  return (
    <Button
      style={styles[variant]}
      uppercase={uppercase}
      mode={modes[variant]}
      {...props}
    >
      <CustomText
        weight="medium"
        style={{ ...styles.text, color: styles[variant].color }}
      >
        {children}
      </CustomText>
    </Button>
  );
};

export default CustomButtom;
