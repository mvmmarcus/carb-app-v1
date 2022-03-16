import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

import CustomText from '#/components/CustomText';
import ArrowDown from '#/../assets/arrow_down.svg';
import ArrowUp from '#/../assets/arrow_up.svg';

import { getStyle } from './styles';

const TargetRange = ({ onValuesChange, ...props }) => {
  const [values, setValues] = useState([90, 120]);

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
            {values[1]} mg/dL
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
        values={[90, 120]}
        min={70}
        max={140}
        sliderLength={240}
        onValuesChange={handleChangeValues}
        markerOffsetY={2}
        {...props}
      />
      <CustomText style={styles.unit}>mg/dL</CustomText>
      <View style={styles.arrowContainer}>
        <ArrowDown />
        <View style={styles.maxMinValueContainer}>
          <CustomText style={styles.maxMinValueTitle} weight="bold">
            Hipo
          </CustomText>
          <CustomText style={styles.maxMinValue} weight="bold">
            {values[0]} mg/dL
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default TargetRange;
