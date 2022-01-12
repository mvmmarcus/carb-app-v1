import React from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import CodeInput from 'react-native-code-input';

import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import { theme } from '../../styles/theme';

import { styles } from './styles';

const SmsVerificationScreen = ({ navigation }) => {
  const { $primary, $secondary, $white, $black } = theme;

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleGroup}>
            <CustomText style={styles.title} weight="bold">
              Insira o código recebido.
            </CustomText>
            <CustomText style={styles.subTitle} weight="regular">
              Enviaremos no seu e-mail!
            </CustomText>
          </View>
          <View style={styles.formGroup}>
            <CodeInput
              containerStyle={{
                width: '100%',
                marginBottom: 24,
              }}
              codeInputStyle={{
                borderRadius: 8,
                backgroundColor: $white,
                color: $black,
              }}
              activeColor={$primary}
              size={48}
              cellBorderWidth={2}
              codeLength={5}
              autoFocus={true}
              borderType="square"
              space={20}
              onFulfill={(code) => console.log({ code })}
            />
            <View style={styles.radioGroup}>
              <CustomText weight="medium" style={styles.link}>
                Reenviar código
              </CustomText>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              backgroundColor={$secondary}
              color={$white}
              onPress={() => navigation?.navigate('CreatePasswordScreen')}
            >
              Enviar
            </CustomButtom>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SmsVerificationScreen;
