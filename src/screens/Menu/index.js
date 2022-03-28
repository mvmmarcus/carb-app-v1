import React from 'react';
import { View } from 'react-native';

import { Avatar } from 'react-native-paper';

import IconPerson from '#/../assets/person.svg';
import IconSettings from '#/../assets/settings.svg';
import IconLogout from '#/../assets/logout.svg';
import IconLightbulb from '#/../assets/lightbulb.svg';
import IconChevronRight from '#/../assets/chevron_right.svg';
import Card from '../../components/Card';
import CustomText from '../../components/CustomText';
import ScreenWrapper from '#/components/ScreenWrapper';

import { getStyle } from './styles';

const MenuScreen = () => {
  const styles = getStyle({});

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={72}
            label="VH"
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <CustomText weight="medium" style={styles.userName}>
            VIctor Hugo
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
        />
      </View>
    </ScreenWrapper>
  );
};

export default MenuScreen;