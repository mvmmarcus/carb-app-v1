import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import Input from '../../components/Input';
import RadioInput from '../../components/RadioInput';
import IconPerson from '../../../assets/person_outline.svg';
import { theme } from '../../styles/theme';

import { styles } from './styles';

const SignUpScreen = ({ navigation }) => {
  const { $primary, $secondary, $white, $medium } = theme;

  const [seeServiceContract, setSeeServiceContract] = useState(false);

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleGroup}>
            <CustomText style={styles.title} weight="bold">
              Vamos fazer seu cadastro.
            </CustomText>
            <CustomText style={styles.subTitle} weight="regular">
              Bom te ter por aqui!
            </CustomText>
          </View>
          <View style={styles.formGroup}>
            <Input
              label="Email"
              placeholder="Digite seu e-mail..."
              iconLabel={<IconPerson />}
              marginBottom={$medium}
              onChange={console.log}
            />

            <View style={styles.radioGroup}>
              <RadioInput
                label="Ver contrato de serviço"
                selected={seeServiceContract}
                onCheck={() => setSeeServiceContract((prev) => !prev)}
              />
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              backgroundColor={$secondary}
              color={$white}
              onPress={() => navigation?.navigate('SmsVerificationScreen')}
            >
              Enviar código de verificação
            </CustomButtom>
            <CustomText weight="medium" style={styles.description}>
              Já tenho cadastro.{' '}
              <CustomText
                onPress={() => navigation?.navigate('SignInScreen')}
                weight="medium"
                style={styles.link}
              >
                Iniciar sessão
              </CustomText>
            </CustomText>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpScreen;
