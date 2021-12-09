import React, { useContext } from 'react';
import { SafeAreaView, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CustomButtom from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import BluetoothContext from '../../contexts/bluetooth';
import LogoSvg from '../../../assets/full_logo.svg';
import GoogleButton from '../../../assets/google_btn.svg';
import WomanAvatar from '../../../assets/woman_avatar.svg';

import { styles } from './styles';

const IndexScreeen = () => {
  const {} = useContext(BluetoothContext);

  return (
    <LinearGradient
      useAngle
      angle={162}
      colors={['#00458F', '#509AE0']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <LogoSvg />
          <View style={styles.hero}>
            <CustomText style={styles.text} weight="regular">
              O melhor cuidado,{'\n'}
              provém de você.
            </CustomText>
            <WomanAvatar />
          </View>
          <View style={styles.buttonGroup}>
            <CustomButtom
              onPress={() => console.log('press')}
              icon={() => (
                <MaterialIcons name="login" size={16} color="#00458F" />
              )}
            >
              Iniciar sessão
            </CustomButtom>
            <CustomButtom
              onPress={() => console.log('press')}
              marginTop={12}
              variant="outlined"
              color="#F2F3F7"
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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default IndexScreeen;
