import React from 'react';
import { View, FlatList, Dimensions } from 'react-native';

import { Button } from 'react-native-paper';

import { getStyle } from './styles';

const Nav = ({ activeOption = '', options = [], onChange }) => {
  const { width } = Dimensions.get('screen');
  const styles = getStyle({ width, optionsLenght: options?.length });

  return (
    <View style={styles.navContainer}>
      <FlatList
        data={options}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?.label}
        ItemSeparatorComponent={() => <View style={styles.navDiviser} />}
        renderItem={({ item }) => (
          <Button
            style={
              activeOption === item?.value
                ? styles.activeNavButton
                : styles.navButton
            }
            contentStyle={{ height: '100%' }}
            labelStyle={
              activeOption === item?.value
                ? styles.activeNavButtonLabel
                : styles.navButtonLabel
            }
            uppercase={false}
            onPress={() => onChange(item?.value)}
            value="left"
          >
            {item?.label}
          </Button>
        )}
      />
    </View>
  );
};

export default Nav;
