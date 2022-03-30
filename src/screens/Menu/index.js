import React, { useContext } from 'react';
import { View } from 'react-native';

import { Avatar } from 'react-native-paper';

import AuthContext from '../../contexts/auth';
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

const MenuScreen = () => {
  const styles = getStyle({});
  const { signout, user } = useContext(AuthContext);

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
        />
        <Card
          as="option"
          style={styles.menuOption}
          title="Sobre o Carbs"
          subtitle="Informações do aplicativo"
          icon={<IconLightbulb />}
          iconRight={<IconChevronRight />}
        />
        <Card
          as="option"
          style={styles.menuOption}
          title="Configurações"
          subtitle="Alteração nas preferências"
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
