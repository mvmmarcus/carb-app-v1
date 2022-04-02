import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

import CustomText from '../CustomText';
import ArrowDown from '../../../assets/arrow_down.svg';
import ArrowUp from '../../../assets/arrow_up.svg';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const TargetRange = ({ onValuesChange, ...props }) => {
  const [values, setValues] = useState([90, 100]);

  const { $red } = theme;
  const styles = getStyle({});

  useEffect(() => {
    !!onValuesChange && onValuesChange(values);
  }, []);

  const handleChangeValues = (values) => {
    !!onValuesChange && onValuesChange(values);

    setValues(values);
  };

  return (
    <View style={styles.container}>
      <View style={styles.arrowContainer}>
        <ArrowUp />
        <View style={styles.maxMinValueContainer}>
          <CustomText style={styles.maxMinValueTitle} weight="bold">
            Hiper
          </CustomText>
          <CustomText style={styles.maxMinValue} weight="bold">
            140 mg/dL
          </CustomText>
        </View>
      </View>
      <CustomText style={styles.title} weight="bold">
        Faixa Alvo
      </CustomText>
      <MultiSlider
        trackStyle={styles.track}
        selectedStyle={styles.selected}
        markerStyle={styles.marker}
        enableLabel
        values={[90, 110]}
        min={70}
        max={140}
        sliderLength={240}
        onValuesChange={handleChangeValues}
        markerOffsetY={2}
        {...props}
      />
      <CustomText style={styles.unit}>mg/dL</CustomText>
      <View style={styles.arrowContainer}>
        <ArrowDown color={$red} />
        <View style={styles.maxMinValueContainer}>
          <CustomText style={styles.maxMinValueTitle} weight="bold">
            Hipo
          </CustomText>
          <CustomText style={styles.maxMinValue} weight="bold">
            70 mg/dL
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default TargetRange;
