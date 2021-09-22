import React from 'react';
import {TouchableOpacity} from 'react-native';

import {Appbar, Avatar} from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({previous, navigation, scene}) => {
  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Avatar.Image
            size={40}
            source={{
              uri: 'https://media-exp1.licdn.com/dms/image/C4D03AQHjlgbSEV5uVA/profile-displayphoto-shrink_400_400/0/1608339221708?e=1637193600&v=beta&t=YHMt_dQVw_I1iqLcYC8GWhVHXI3-uTYblm-SxXk6J4A',
            }}
          />
        </TouchableOpacity>
      )}

      {/* <Appbar.Content
        title={<MaterialCommunityIcons name="twitter" size={40} />}
      /> */}
    </Appbar.Header>
  );
};

export default Header;
