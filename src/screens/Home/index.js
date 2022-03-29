import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';

import IconMaterial from 'react-native-vector-icons/MaterialIcons';

import UserContext from '../../contexts/user';
import AuthContext from '../../contexts/auth';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import useOrientation from '../../hooks/useOrientation';
import GlucoseChart from '../../components/GlucoseChart';
import ScreenWrapper from '../../components/ScreenWrapper';
import BluetoothContext from '../../contexts/bluetooth';

import { theme } from '../../styles/theme';
import { getStyle } from './styles';

const HomeScreen = () => {
  const styles = getStyle({});
  const { $primary } = theme;
  const { records } = useContext(BluetoothContext);
  const { width } = useOrientation();
  const { isFirstAccess, insulinParams } = useContext(UserContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log({ user, isFirstAccess, insulinParams });
  }, []);

  const data = {
    labels: ['01:00h', '02:00h', '13:00h', '14:00h'],
    datasets: [
      {
        data: [100, 40, 180, 60],
      },
    ],
  };

  const infoBadges = [
    {
      value: 120,
      title: 'Média',
      subtitle: 'mg/dL',
    },
    {
      values: [1, 0],
      title: 'Hiper',
      subtitle: 'Hipo',
    },
    {
      value: 60,
      title: 'Carbs',
      subtitle: 'g',
    },
    {
      value: 14,
      title: 'Bolus',
      subtitle: 'ui',
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <GlucoseChart width={width - 40} data={data} />
        <View style={styles.conectMeterBox}>
          <Card
            subtitle="Conecte seu medidor Bluetooth"
            buttonLabel="Conectar"
            icon={
              <IconMaterial
                size={28}
                name="perm-device-info"
                color={$primary}
              />
            }
          />
        </View>
        <View style={styles.infosBox}>
          {infoBadges.map((item, index) => {
            const isLastItem = infoBadges?.length - 1 === index;

            return (
              <Badge
                style={{
                  marginRight: isLastItem ? 0 : 16,
                }}
                key={index}
                title={item?.title}
                subtitle={item?.subtitle}
                value={item?.value}
                values={item?.values}
              />
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
