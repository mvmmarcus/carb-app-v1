import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import IconLock from '../../../assets/lock.svg';
import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import Input from '../../components/Input';
import IconPerson from '../../../assets/person_outline.svg';

import { theme } from '../../styles/theme';
import { styles } from './styles';

const SignUpScreen = ({ navigation }) => {
  const { $primary, $small, $secondary, $white, $medium } = theme;
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) {
        alert('Please enter correct password');

        return;
      }

      const userCredntial = await auth().createUserWithEmailAndPassword(
        userEmail,
        password
      );

      console.log({ userCredntial });
    } catch (error) {
      console.log('handleSignup error: ', error);
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
              isSecurity
            />
            <Input
              label="Confirmar senha"
              placeholder="Confirme sua senha"
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
              onChange={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              isSecurity={!showPassword}
            />
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              backgroundColor={$secondary}
              color={$white}
              onPress={() => handleSignup()}
            >
              Confirmar
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
