import React from 'react';
import { View } from 'react-native';

import CustomText from '#/components/CustomText';

import { getStyle } from './styles';
import { Divider } from 'react-native-paper';

const Badge = ({
  title = 'title',
  value = 120,
  subtitle = 'subtitle',
  style = {},
  values = [],
}) => {
  const styles = getStyle({});

  return (
    <View style={{ ...styles.container, ...style }}>
      <CustomText weight="regular" style={styles.title}>
        {title}
      </CustomText>
      {values?.length > 1 ? (
        <View>
          <CustomText weight="bold" style={styles.diviserValue}>
            {values[0]}
          </CustomText>
          <Divider style={styles.diviser} />
          <CustomText weight="bold" style={styles.diviserValue}>
            {values[1]}
          </CustomText>
        </View>
      ) : (
        <CustomText weight="bold" style={styles.value}>
          {value}
        </CustomText>
      )}

      <CustomText weight="regular" style={styles.subtitle}>
        {subtitle}
      </CustomText>
    </View>
  );
};

export default Badge;
