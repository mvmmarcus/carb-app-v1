import React, { useState, useContext } from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import Snackbar from '../../components/Snackbar';
import IconPerson from '#/../assets/person_outline.svg';
import IconLock from '#/../assets/lock.svg';
import AuthContext from '../../contexts/auth';
import CustomButton from '#/components/CustomButton';
import CustomText from '#/components/CustomText';
import Input from '#/components/Input';
// import RadioInput from '#/components/RadioInput';
import { getErrorMessage } from '../../utils/errors';

import { styles } from './styles';
import { theme } from '#/styles/theme';

const SignInScreen = ({ navigation }) => {
  const { $primary, $secondary, $white, $medium, $small } = theme;
  // const [rememberLogin, setRememberLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { signin } = useContext(AuthContext);

  const handleSignin = async (email, password) => {
    try {
      await signin(email, password);
    } catch (error) {
      console.log('handleSignin error: ', error?.code);
      setFormError(getErrorMessage(error?.code));
    }
  };

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <Snackbar message={formError} onDismiss={() => setFormError(null)} />
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
              placeholder="Digite seu e-mail"
              iconLabel={<IconPerson />}
              marginBottom={$medium}
              onChange={(email) => setUserEmail(email)}
            />
            <Input
              label="Senha"
              placeholder="Digite sua senha"
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
              onChange={(password) => setPassword(password)}
              isSecurity={!showPassword}
            />
            <View style={styles.radioGroup}>
              {/* <RadioInput
                label="Lembrar do login"
                selected={rememberLogin}
                onCheck={() => setRememberLogin((prev) => !prev)}
              /> */}
              <CustomText
                weight="medium"
                style={{ ...styles.link, color: $white }}
              >
                Esqueci minha senha
              </CustomText>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <CustomButton
              disabled={!userEmail || !password}
              backgroundColor={$secondary}
              color={$white}
              onPress={() => handleSignin(userEmail, password)}
            >
              Entrar
            </CustomButton>
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
