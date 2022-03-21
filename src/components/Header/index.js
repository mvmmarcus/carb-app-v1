import React from 'react';
import { View } from 'react-native';

import { Appbar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import IconFilter from '#/../assets/filter_list.svg';
import CustomText from '#/components/CustomText';
import { theme } from '#/styles/theme';

import { getStyle } from './styles';

const Header = ({ back, navigation, title, onFilter }) => {
  const styles = getStyle({});
  const { $white } = theme;

  return (
    <Appbar.Header style={styles.container}>
      {back && (
        <Appbar.BackAction
          color={$white}
          onPress={() => navigation?.goBack()}
        />
      )}
      <View style={styles.content}>
        {!!title && (
          <CustomText style={styles.title} weight="bold">
            {title}
          </CustomText>
        )}
        {!!onFilter && (
          <TouchableOpacity>
            <IconFilter />
          </TouchableOpacity>
        )}
      </View>
    </Appbar.Header>
  );
};

export default React.memo(Header);
