import React from 'react';
import { View } from 'react-native';

import { Title } from 'react-native-paper';

import { getBackgroundColor } from '../../utils/global';

import { Time, Value, ValueCircle, ValueUnit, Wrapper } from './styles';

const Measurement = ({ value, date, time }) => {
  return (
    <Wrapper>
      <ValueCircle color={getBackgroundColor(value)}>
        <Value>{value}</Value>
        <ValueUnit>mg/dL</ValueUnit>
      </ValueCircle>
      <View>
        <Title>{date}</Title>
        <Time>às {time}h</Time>
      </View>
    </Wrapper>
  );
};

export default React.memo(Measurement);
