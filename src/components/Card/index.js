import React from 'react';
import { View } from 'react-native';

import { Button } from 'react-native-paper';

import CustomText from '#/components/CustomText';

import { getStyle } from './styles';

const Card = ({ icon, title, subtitle, buttonLabel, onCallAction }) => {
  const styles = getStyle({});

  const handleAction = () => {
    !!onCallAction && onCallAction();
  };

  return (
    <View style={styles.container}>
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
  );
};

export default Card;
