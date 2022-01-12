import React from 'react';
import { View } from 'react-native';

import CustomText from '../CustomText';

import { getStyle } from './styles';

const RadioInput = ({
  size = 14,
  selected = false,
  onCheck,
  color = '#F2F3F7',
  labelSize = 12,
  label = '',
}) => {
  const styles = getStyle({ size, color, labelSize });

  return (
    <View style={styles.container} onTouchStart={onCheck}>
      <View onPress={onCheck} style={styles.button}>
        {selected ? <View style={styles.buttonChecked} /> : null}
      </View>
      <CustomText weight="medium" style={styles.label}>
        {!!label && label}
      </CustomText>
    </View>
  );
};

export default RadioInput;
