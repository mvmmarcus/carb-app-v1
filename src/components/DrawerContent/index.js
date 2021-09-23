import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Drawer,
  TouchableRipple,
  Text,
} from 'react-native-paper';

const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: 'https://media-exp1.licdn.com/dms/image/C4D03AQHjlgbSEV5uVA/profile-displayphoto-shrink_400_400/0/1608339221708?e=1637193600&v=beta&t=YHMt_dQVw_I1iqLcYC8GWhVHXI3-uTYblm-SxXk6J4A',
            }}
            size={50}
          />
          <Title style={styles.title}>Marcus Vinicius</Title>
          <Caption style={styles.caption}>@mvmmarcus</Caption>
        </View>

        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => props?.navigation.navigate('Screen')}>
            <View style={styles.preference}>
              <Text>Screen</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Sair</Text>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingBottom: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;
