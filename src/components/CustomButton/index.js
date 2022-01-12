import React from 'react';
import { View } from 'react-native';

import { Button, IconButton } from 'react-native-paper';
import CustomText from '../CustomText';

import { getStyle } from './styles';

const CustomButtom = ({
  children,
  variant = 'contained',
  uppercase = false,
  fontWeight = 'medium',
  icon,
  ...props
}) => {
  const styles = getStyle({ ...props });

  return icon && !children ? (
    <IconButton style={styles[variant]} icon={icon} {...props} />
  ) : (
    <Button
      style={styles[variant]}
      uppercase={uppercase}
      mode={variant}
      icon={icon}
      contentStyle={{
        width: '100%',
        height: '100%',
      }}
      {...props}
    >
      <CustomText weight={fontWeight} style={styles.text}>
        {children}
      </CustomText>
    </Button>
  );
};

export default CustomButtom;
