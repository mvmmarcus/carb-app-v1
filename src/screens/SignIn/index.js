import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import Input from '../../components/Input';
import RadioInput from '../../components/RadioInput';
import { theme } from '../../styles/theme';

import IconPerson from '../../../assets/person_outline.svg';
import IconLock from '../../../assets/lock.svg';
import { styles } from './styles';

const SignInScreen = ({ navigation }) => {
  const { $primary, $secondary, $white, $medium, $small } = theme;

  const [rememberLogin, setRememberLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleGroup}>
            <CustomText style={styles.title} weight="bold">
              Vamos fazer seu login.
            </CustomText>
            <CustomText style={styles.subTitle} weight="regular">
              Bom te ver de volta!
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
            <Input
              label="Senha"
              placeholder="Digite sua senha..."
              iconLabel={<IconLock />}
              iconInput={
                showPassword ? (
                  <FontAwesome5Icon
                    name="eye"
                    size={20}
                    color={$primary}
                    onPress={() => setShowPassword((prev) => !prev)}
                  />
                ) : (
                  <FontAwesome5Icon
                    name="eye-slash"
                    size={20}
                    color={$primary}
                    onPress={() => setShowPassword((prev) => !prev)}
                  />
                )
              }
              marginBottom={$small}
              onChange={console.log}
              isSecurity={!showPassword}
            />
            <View style={styles.radioGroup}>
              <RadioInput
                label="Lembrar do login"
                selected={rememberLogin}
                onCheck={() => setRememberLogin((prev) => !prev)}
              />
              <CustomText
                weight="medium"
                style={{ ...styles.link, color: $white }}
              >
                Esqueci minha senha
              </CustomText>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              backgroundColor={$secondary}
              color={$white}
              onPress={() => console.log('press')}
            >
              Entrar
            </CustomButtom>
            <CustomText weight="medium" style={styles.description}>
              Sou novo por aqui.{' '}
              <CustomText
                onPress={() => navigation?.navigate('SignUpScreen')}
                weight="medium"
                style={styles.link}
              >
                Registrar-se
              </CustomText>
            </CustomText>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignInScreen;