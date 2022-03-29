import React, { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import IconLock from '../../../assets/lock.svg';
import AuthContext from '../../contexts/auth';
import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import Input from '../../components/Input';
import { theme } from '../../styles/theme';

import { styles } from './styles';

const CreatePasswordScreen = ({ navigation }) => {
  const { $primary, $secondary, $white, $medium, $small } = theme;

  const [rememberLogin, setRememberLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleGroup}>
            <CustomText style={styles.title} weight="bold">
              Crie sua senha.
            </CustomText>
            <CustomText style={styles.subTitle} weight="regular">
              Estamos quase acabando!
            </CustomText>
          </View>
          <View style={styles.formGroup}>
            <Input
              label="Senha"
              placeholder="Digite sua senha..."
              iconLabel={<IconLock />}
              marginBottom={$medium}
              onChange={console.log}
              isSecurity
            />
            <Input
              label="Confirmar senha"
              placeholder="Confirme sua senha..."
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
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              backgroundColor={$secondary}
              color={$white}
              onPress={() => null}
            >
              Finalizar
            </CustomButtom>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default CreatePasswordScreen;
