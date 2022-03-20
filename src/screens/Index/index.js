import React from 'react';
import { View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import LogoSvg from '../../../assets/full_logo.svg';
import GoogleButton from '../../../assets/google_btn.svg';
import IconWomanAvatar from '../../../assets/woman_avatar.svg';

import { styles } from './styles';
import { theme } from '../../styles/theme';

const IndexScreeen = ({ navigation }) => {
  const { $primary, $secondary, $white } = theme;

  return (
    <LinearGradient colors={[$secondary, $primary]} style={styles.gradient}>
      <View style={styles.container}>
        <LogoSvg />
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
            Iniciar sessão
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
        </View>
        <GoogleButton
          onPress={() => console.log('teste')}
          width={60}
          height={60}
          marginTop={16}
        />
      </View>
    </LinearGradient>
  );
};

export default IndexScreeen;
