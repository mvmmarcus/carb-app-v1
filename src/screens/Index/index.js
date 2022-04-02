import React from 'react';
import { View, ScrollView } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import LogoSvg from '../../../assets/full_logo.svg';
import IconWomanAvatar from '../../../assets/woman_avatar.svg';

import { styles } from './styles';
import { theme } from '../../styles/theme';

const IndexScreeen = ({ navigation }) => {
  const { $primary, $secondary, $white } = theme;

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <View style={styles.logo}>
        <LogoSvg />
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.hero}>
            <CustomText style={styles.text} weight="regular">
              O melhor cuidado, provém de você.
            </CustomText>
            <IconWomanAvatar />
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              onPress={() => navigation?.navigate('SignInScreen')}
              icon={() => (
                <MaterialIcons name="login" size={16} color={$secondary} />
              )}
            >
              Fazer login
            </CustomButtom>
            <CustomButtom
              onPress={() => navigation?.navigate('SignUpScreen')}
              marginTop={12}
              variant="outlined"
              backgroundColor="transparent"
              color={$white}
            >
              Registrar-se
            </CustomButtom>
            <CustomText style={styles.terms}>
              Ao continuar, você afirma que leu e concorda com os
            </CustomText>
            <CustomText
              onPress={() => navigation?.navigate('AboutScreen')}
              weight="medium"
              style={styles.link}
            >
              Termos de utilização
            </CustomText>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default IndexScreeen;
