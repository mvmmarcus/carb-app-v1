import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';

import { Appbar, Avatar } from 'react-native-paper';

import { HeaderContent } from './styles';

const Header = ({ back, navigation }) => {
  return (
    <Appbar.Header
      style={{
        backgroundColor: '#509AE0',
      }}
    >
      {back && <Appbar.BackAction onPress={() => navigation?.goBack()} />}
      <TouchableOpacity
        style={{ position: 'absolute', left: 10, zIndex: 2 }}
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
        <View>
          <Image
            source={require('../../../assets/logo.png')}
            style={{ width: 40, height: 44, resizeMode: 'stretch' }}
          />
        </View>
      </HeaderContent>
    </Appbar.Header>
  );
};

export default React.memo(Header);
