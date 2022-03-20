import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import CustomText from '../CustomText';

import { getStyle } from './styles';

const Input = ({
  variant = 'default',
  label = '',
  labelColor,
  placeholder = '',
  iconLabel = null,
  iconInput = null,
  onChange,
  value = '',
  type = 'default',
  isSecurity = false,
  labelStyles = {},
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);

  const styles = getStyle({
    ...props,
    paddingRight: !!iconInput ? '3.25rem' : '1rem',
  });

  const handleChange = (value) => {
    !!onChange && onChange(value);
    setInputValue(value);
  };

  const { labelGroup } = styles;

  return (
    <View>
      <View style={{ ...labelGroup, ...labelStyles }}>
        {!!iconLabel && iconLabel}
        <CustomText weight="regular" style={styles.label}>
          {label}
        </CustomText>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={isSecurity}
          keyboardType={type}
          value={inputValue}
          onChangeText={handleChange}
          style={styles[variant]}
          placeholder={placeholder}
        />
        {!!iconInput && <View style={styles.iconInput}>{iconInput}</View>}
      </View>
    </View>
  );
};

export default Input;
