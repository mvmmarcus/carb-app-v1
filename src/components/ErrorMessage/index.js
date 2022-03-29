import React from 'react';
import { View } from 'react-native';

import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../CustomText';

import { styles } from './styles';

const ErrorBox = ({
  errorMessage = '',
  errorTitle = 'Mensagem de erro',
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <IconMC size={20} name="alert-circle" style={styles.alertIcon} />
      <View style={styles.content}>
        <View>
          <CustomText weight="medium" style={styles.errorSubtitle}>
            {errorMessage}
          </CustomText>
        </View>
      </View>
      <IconMC
        size={20}
        onPress={onClose}
        name="close"
        style={styles.closeIcon}
      />
    </View>
  );
};

export default ErrorBox;
