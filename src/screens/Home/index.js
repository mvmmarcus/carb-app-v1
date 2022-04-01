import React, { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';

import CustomText from '../../components/CustomText';
import AuthContext from '../../contexts/auth';
import Badge from '../../components/Badge';
import Card from '../../components/Card';
import useOrientation from '../../hooks/useOrientation';
import GlucoseChart from '../../components/GlucoseChart';
import ScreenWrapper from '../../components/ScreenWrapper';
import BluetoothContext from '../../contexts/bluetooth';
import UserContext from '../../contexts/user';
import { jsonParse } from '../../utils/jsonParse';
import {
  getAverageValue,
  getCaptalizedFirstName,
  getTotal,
} from '../../utils/global';

import { theme } from '../../styles/theme';
import { getStyle } from './styles';

const HomeScreen = ({ navigation }) => {
  const styles = getStyle({});
  const { $primary } = theme;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const {
    bloodGlucoses,
    connectedPeripheral,
    isGettingBloodGlucoses,
    setBloodGlucoses,
  } = useContext(BluetoothContext);
  const { user } = useContext(AuthContext);
  const { insulinParams } = useContext(UserContext);
  const { width } = useOrientation();

  const getStoragedBloodGlucoses = async (user) => {
    setIsLoading(true);
    try {
      const userInfosByUid = jsonParse(
        await AsyncStorage.getItem(`@carbs:${user?.uid}`)
      );
      const bloodGlucoses = userInfosByUid?.bloodGlucoses;
      setBloodGlucoses(bloodGlucoses);
    } catch (error) {
      console.log('getStoragedBloodGlucoses error: ', error);
      setBloodGlucoses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bloodGlucoses?.length === 0 && !isGettingBloodGlucoses) {
      getStoragedBloodGlucoses(user);
    }
  }, []);

  const filterBoodGlucosesByDate = (date, bloodGlucoses = []) => {
    const calendarDate = date?.toLocaleString('en-ZA', {
      dateStyle: 'short',
    });

    const filteredBloodGlucoses = bloodGlucoses?.filter(
      (item) => item?.date === calendarDate
    );

    const bloodGlucoseChartData = {
      labels: filteredBloodGlucoses?.map(
        (bloodGlucose) => `${bloodGlucose?.time?.slice(0, 5)}h`
      ),
      datasets: [
        {
          data: filteredBloodGlucoses?.map(
            (bloodGlucose) => bloodGlucose?.value
          ),
        },
      ],
    };

    return { bloodGlucoseChartData, filteredBloodGlucoses };
  };

  const { bloodGlucoseChartData, filteredBloodGlucoses } =
    filterBoodGlucosesByDate(selectedDate, bloodGlucoses);

  const getHiperAndHipoCounts = (bloodGlucoses = []) => {
    const hipoCounts = bloodGlucoses?.filter(
      (item) => item?.value <= 70
    )?.length;
    const hiperCounts = bloodGlucoses?.filter(
      (item) => item?.value >= 140
    )?.length;

    return [hiperCounts, hipoCounts];
  };

  const infoBadges = [
    {
      value: getAverageValue({
        values: filteredBloodGlucoses?.map((item) => item?.value),
      }),
      title: 'Média',
      subtitle: 'mg/dL',
    },
    {
      values: getHiperAndHipoCounts(filteredBloodGlucoses),
      title: 'Hiper',
      subtitle: 'Hipo',
    },
    {
      value: getTotal(
        filteredBloodGlucoses?.map((item) => parseFloat(item?.carbs) || 0)
      )?.toFixed(0),
      title: 'Carbs',
      subtitle: 'g',
    },
    {
      value: getTotal(
        filteredBloodGlucoses?.map(
          (item) => item?.correction + item?.insulin || 0
        )
      ),
      title: 'Bolus',
      subtitle: 'ui',
    },
  ];

  return (
    <ScreenWrapper isLoading={isLoading}>
      <View style={styles.container}>
        <CustomText weight="bold" style={styles.userName}>
          Olá, {getCaptalizedFirstName(user?.displayName)}
        </CustomText>
        <GlucoseChart
          width={width - 40}
          data={bloodGlucoseChartData}
          insulinParams={insulinParams}
          onDateChange={setSelectedDate}
        />
        {!connectedPeripheral && (
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
              onCallAction={() => navigation?.navigate('SyncStack')}
            />
          </View>
        )}
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
