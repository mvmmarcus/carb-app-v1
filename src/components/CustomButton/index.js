import React from 'react';

import { Button, IconButton } from 'react-native-paper';
import CustomText from '../../components/CustomText';

import { getStyle } from './styles';

const CustomButtom = ({
  children,
  variant = 'contained',
  uppercase = false,
  fontWeight = 'medium',
  icon,
  onToggle,
  isActive = false,
  value,
  disabled = false,
  isLoading = false,
  style = {},
  ...props
}) => {
  const styles = getStyle({ ...props });

  const handleToggle = () => {
    !!onToggle && onToggle(value);
  };

  return icon && !children ? (
    <IconButton
      style={{ ...styles[variant], ...style }}
      icon={icon}
      {...props}
    />
  ) : !!onToggle ? (
    <Button
      disabled={disabled}
      style={
        disabled
          ? { ...styles.disabled, ...style }
          : { ...styles[variant], ...style }
      }
      labelStyle={{ ...styles.text, color: styles.text.color }}
      uppercase={uppercase}
      mode={variant}
      icon={icon}
      contentStyle={{
        width: '100%',
        height: '100%',
      }}
      onPress={handleToggle}
      {...props}
    >
      {children}
    </Button>
  ) : (
    <Button
      labelStyle={{ ...styles.text, color: styles.text.color }}
      loading={isLoading}
      disabled={disabled}
      style={
        disabled
          ? { ...styles.disabled, ...style }
          : { ...styles[variant], ...style }
      }
      uppercase={uppercase}
      mode={variant}
      icon={icon}
      contentStyle={{
        width: '100%',
        height: '100%',
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButtom;
