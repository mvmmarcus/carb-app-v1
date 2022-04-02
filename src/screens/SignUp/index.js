import React, { useState, useContext } from 'react';
import { ScrollView, View } from 'react-native';

import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import AuthContext from '../../contexts/auth';
import IconLock from '../../../assets/lock.svg';
import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import Input from '../../components/Input';
import IconPerson from '../../../assets/person_outline.svg';
import { getErrorMessage } from '../../utils/errors';

import { theme } from '../../styles/theme';
import { styles } from './styles';

const SignUpScreen = ({ navigation }) => {
  const { $primary, $small, $secondary, $white, $medium } = theme;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup } = useContext(AuthContext);

  const handleSignup = async () => {
    setIsLoadingSignup(true);
    try {
      if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'A confirmação de senha falhou. Tente novamente',
        });
        return;
      }

      await signup(userName, userEmail, password);
    } catch (error) {
      console.log('handleSignup error: ', error);
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error?.code),
      });
    } finally {
      setIsLoadingSignup(false);
    }
  };

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <CustomText style={styles.title} weight="bold">
          Vamos fazer seu cadastro
        </CustomText>
        <View style={styles.container}>
          <View style={styles.titleGroup}></View>
          <View style={styles.formGroup}>
            <Input
              label="Nome"
              placeholder="Digite seu nome"
              iconLabel={<IconPerson />}
              marginBottom={$medium}
              onChange={(name) => setUserName(name)}
            />
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
              marginBottom={$medium}
              onChange={(password) => setPassword(password)}
              isSecurity={!showPassword}
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
            />
            <Input
              label="Confirmar senha"
              placeholder="Confirme sua senha"
              iconLabel={<IconLock />}
              iconInput={
                showConfirmPassword ? (
                  <FontAwesome5Icon
                    name="eye"
                    size={20}
                    color={$primary}
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                  />
                ) : (
                  <FontAwesome5Icon
                    name="eye-slash"
                    size={20}
                    color={$primary}
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                  />
                )
              }
              marginBottom={$small}
              onChange={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              isSecurity={!showConfirmPassword}
            />
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              isLoading={isLoadingSignup}
              disabled={
                !userEmail || !password || !confirmPassword || !userName
              }
              backgroundColor={$secondary}
              color={$white}
              onPress={() => !isLoadingSignup && handleSignup()}
            >
              {isLoadingSignup ? '' : 'Confirmar'}
            </CustomButtom>
            <CustomText weight="medium" style={styles.description}>
              Já tenho cadastro.{' '}
              <CustomText
                onPress={() => navigation?.navigate('SignInScreen')}
                weight="medium"
                style={styles.link}
              >
                Fazer login
              </CustomText>
            </CustomText>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpScreen;
