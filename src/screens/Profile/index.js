import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import AuthContext from '../../contexts/auth';
import IconLock from '../../../assets/lock.svg';
import CustomButtom from '../../components/CustomButton';
import Input from '../../components/Input';
import IconPerson from '../../../assets/person_outline.svg';
import { getErrorMessage } from '../../utils/errors';

import { theme } from '../../styles/theme';
import { styles } from './styles';

const ProfileScreen = ({ navigation }) => {
  const { $primary, $small, $secondary, $white, $medium } = theme;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [userName, setUserName] = useState(user?.displayName);
  const [userEmail, setUserEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (user) {
        setUserName(user?.displayName);
        setUserEmail(user?.email);
      }
    }, [user])
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!!password) {
        if (password !== confirmPassword) {
          Toast.show({
            type: 'error',
            text1: 'A confirmação de senha falhou. Tente novamente',
          });
          return;
        }

        await auth().currentUser.updatePassword(confirmPassword);
      }

      if (userName !== user?.displayName) {
        await auth().currentUser.updateProfile({ displayName: userName });
      }

      if (userEmail !== user?.email) {
        await auth().currentUser.updateEmail(userEmail);
      }

      setUser({
        ...user,
        email: userEmail,
        displayName: userName,
      });

      Toast.show({
        type: 'success',
        text1: 'Perfil atualizado com sucesso!',
      });

      navigation?.goBack();
    } catch (error) {
      console.log('handleSignup error: ', error);
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error?.code),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleGroup}></View>
          <View style={styles.formGroup}>
            <Input
              label="Nome"
              placeholder="Digite seu nome"
              iconLabel={<IconPerson />}
              marginBottom={$medium}
              value={userName}
              onChange={(name) => setUserName(name)}
            />
            <Input
              label="Email"
              placeholder="Digite seu e-mail"
              iconLabel={<IconPerson />}
              marginBottom={$medium}
              value={userEmail}
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
              disabled={!userEmail || !userName}
              isLoading={isSaving}
              backgroundColor={$secondary}
              color={$white}
              onPress={() => handleSave()}
            >
              {isSaving ? '' : 'Salvar'}
            </CustomButtom>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;
