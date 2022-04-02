import React, { useContext } from 'react';
import { View } from 'react-native';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper';

import AuthContext from '../../contexts/auth';
import UserContext from '../../contexts/user';
import IconPerson from '../../../assets/person.svg';
import IconSettings from '../../../assets/settings.svg';
import IconLogout from '../../../assets/logout.svg';
import IconLightbulb from '../../../assets/lightbulb.svg';
import IconChevronRight from '../../../assets/chevron_right.svg';
import Card from '../../components/Card';
import CustomText from '../../components/CustomText';
import ScreenWrapper from '../../components/ScreenWrapper';
import { getInitialsOfName } from '../../utils/global';

import { getStyle } from './styles';

const MenuScreen = ({ navigation }) => {
  const styles = getStyle({});
  const { signout, user } = useContext(AuthContext);
  const { setIsEditInfos } = useContext(UserContext);

  const handleSignout = async () => {
    try {
      await signout();
    } catch (error) {
      console.log('handleSignout error: ', error);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={72}
            label={getInitialsOfName(user?.displayName)}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <CustomText weight="medium" style={styles.userName}>
            {user?.displayName}
          </CustomText>
        </View>
        <Card
          as="option"
          style={styles.menuOption}
          title="Meu Perfil"
          subtitle="Ver e editar perfil"
          icon={<IconPerson />}
          iconRight={<IconChevronRight />}
          onPress={() => navigation?.navigate('ProfileScreen')}
        />
        <Card
          as="option"
          style={styles.menuOption}
          title="Parâmetros de Cálculo"
          subtitle="Editar parâmetros médicos para o cálculo de insulina"
          icon={<IconPerson />}
          iconRight={<IconChevronRight />}
          onPress={() => setIsEditInfos(true)}
        />

        <Card
          as="option"
          style={styles.menuOption}
          title="Sobre o Carbs"
          subtitle="Informações do aplicativo"
          icon={<IconLightbulb />}
          iconRight={<IconChevronRight />}
          onPress={() => navigation?.navigate('AboutScreen')}
        />
        <Card
          as="option"
          style={styles.menuOption}
          title="Configurações"
          subtitle="Alterar preferências"
          icon={<IconSettings />}
          iconRight={<IconChevronRight />}
        />
        <Card
          as="option"
          style={styles.menuOption}
          title="Sair do aplicativo"
          icon={<IconLogout />}
          iconRight={<IconChevronRight />}
          onPress={handleSignout}
        />
      </View>
    </ScreenWrapper>
  );
};

export default MenuScreen;
