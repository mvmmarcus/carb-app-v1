import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Appbar, Avatar } from 'react-native-paper';

import { HeaderContent } from './styles';

const Header = ({ back, navigation }) => {
  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={() => navigation?.goBack()} />}
      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Avatar.Image
          size={40}
          source={{
            uri: 'https://media-exp1.licdn.com/dms/image/C4D03AQHjlgbSEV5uVA/profile-displayphoto-shrink_400_400/0/1608339221708?e=1637193600&v=beta&t=YHMt_dQVw_I1iqLcYC8GWhVHXI3-uTYblm-SxXk6J4A',
          }}
        />
      </TouchableOpacity>

      <HeaderContent>
        <Text>Carbapp</Text>
      </HeaderContent>
    </Appbar.Header>
  );
};

export default Header;
