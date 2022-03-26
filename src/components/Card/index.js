import React from 'react';
import { View } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

import CustomText from '#/components/CustomText';

import { getStyle } from './styles';

const Card = ({
  icon,
  iconRight,
  title,
  subtitle,
  buttonLabel,
  onCallAction,
  style = {},
  as = 'card',
}) => {
  const styles = getStyle({});

  const handleAction = () => {
    !!onCallAction && onCallAction();
  };

  return as === 'card' ? (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.titleContainer}>
        {!!icon && icon}
        <View style={styles.textContainer}>
          {!!title && (
            <CustomText weight="bold" style={styles.title}>
              {title}
            </CustomText>
          )}
          {!!subtitle && (
            <CustomText style={styles.subtitle}>{subtitle}</CustomText>
          )}
        </View>
      </View>
      {!!buttonLabel && (
        <Button
          onPress={() => handleAction()}
          uppercase={false}
          icon="bluetooth"
          mode="contained"
          style={styles.actionButton}
          labelStyle={styles.actionButtonLabel}
        >
          {buttonLabel}
        </Button>
      )}
    </View>
  ) : (
    <TouchableOpacity style={{ ...styles.container, ...style }}>
      <View style={styles.titleContainer}>
        {!!icon && icon}
        <View style={styles.textContainer}>
          {!!title && (
            <CustomText weight="bold" style={styles.title}>
              {title}
            </CustomText>
          )}
          {!!subtitle && (
            <CustomText style={styles.subtitle}>{subtitle}</CustomText>
          )}
        </View>
        {!!iconRight && iconRight}
      </View>
    </TouchableOpacity>
  );
};

export default Card;
