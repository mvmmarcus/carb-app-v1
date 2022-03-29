import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-select-dropdown';

import FallbackMessage from '../../components/FallbackMessage';
import IconDataNotFound from '../../../assets/data_not_found.svg';
import MealAccordion from '../../components/MealAccordion';
import ScreenWrapper from '../../components/ScreenWrapper';
import CustomText from '../../components/CustomText';
import BluetoothContext from '../../contexts/bluetooth';
import { sortByDate, monthNames, sortByMonth } from '../../utils/date';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const RegistersScreeen = (props) => {
  const styles = getStyle({});
  const { $secondary } = theme;

  const { isGettingRecords, records } = useContext(BluetoothContext);
  const [year, setYear] = useState('2022');
  const [registers, setRegisters] = useState([]);

  const meals = [
    {
      id: 1,
      date: '2022/03/23',
      time: '12:00',
      type: 'Almoço',
      glucose: 100,
      carbs: 30,
      insulin: 4,
      correction: 2,
    },
    {
      id: 2,
      date: '2022/03/23',
      time: '16:00',
      type: 'Lanche',
      glucose: 70,
      carbs: 30,
      insulin: 4,
      correction: 1,
    },
    {
      id: 3,
      date: '2022/03/25',
      time: '16:00',
      type: 'Lanche',
      glucose: 70,
      carbs: 30,
      insulin: 4,
      correction: 1,
    },
    {
      id: 4,
      date: '2022/02/22',
      time: '04:04',
      type: 'Jantar',
      glucose: 150,
      carbs: 30,
      insulin: 4,
      correction: 2,
    },
    {
      id: 5,
      date: '2022/01/23',
      time: '22:00',
      type: 'Lanche',
      glucose: 60,
      carbs: 30,
      insulin: 4,
      correction: 2,
    },
  ];

  useEffect(() => {
    const getRecords = async () => {
      const storadeRegisters = await AsyncStorage.getItem('@registers');
      const registers = JSON.parse(storadeRegisters);

      const formatedRegisters = registers?.map((item, index) => {
        return {
          ...item,
          time: item?.time?.slice(0, 5),
          glucose: item?.value,
          id: index + 1,
        };
      });

      setRegisters(formatedRegisters);
    };

    getRecords();
  }, []);

  // filtrar por ano antes de entrar aqui
  const groupMealsByMonth = (meals = []) => {
    const dateGroups = meals.reduce((dateGroups, meal) => {
      const date = meal.date;
      if (!dateGroups[date]) {
        dateGroups[date] = [];
      }
      dateGroups[date].push(meal);
      return dateGroups;
    }, {});

    const groupArraysByDate = Object.keys(dateGroups).map((date) => {
      return {
        date,
        meals: dateGroups[date],
      };
    });

    const monthGroups = groupArraysByDate.reduce((monthGroups, date) => {
      const splittedMonth = date?.date?.split('/')[1];
      const monthNumber = Number(splittedMonth);

      if (!monthGroups[monthNumber]) {
        monthGroups[monthNumber] = [];
      }
      monthGroups[monthNumber].push(date);
      return monthGroups;
    }, {});

    const groupArraysByMonth = Object.keys(monthGroups).map((month) => {
      return {
        month: Number(month) - 1, // 0 => jan, 1 => fev
        monthName: monthNames[Number(month) - 1],
        dates: monthGroups[month],
      };
    });

    return groupArraysByMonth || [];
  };

  const formatDateByDayAndMonth = (selectedDate) => {
    const date = new Date(selectedDate);
    const day = date?.getDate();
    const month = monthNames[date?.getMonth()];
    const formattedDate = `${day} de ${month}`;

    return formattedDate;
  };

  const mealsByMonth = groupMealsByMonth(registers);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {mealsByMonth?.length > 0 && (
          <DropDownPicker
            defaultValue={year}
            data={['2022', '2021']}
            onSelect={setYear}
            buttonStyle={styles.filterButton}
            buttonTextStyle={styles.filterButtonLabel}
          />
        )}

        <FlatList
          contentContainerStyle={{
            flex: 1,
          }}
          data={mealsByMonth?.sort(sortByMonth)}
          renderItem={({ item }) => {
            return (
              <>
                <CustomText weight="bold" style={styles.registerTitle}>
                  {item?.monthName}
                </CustomText>
                <FlatList
                  data={item?.dates?.sort(sortByDate)}
                  renderItem={({ item }) => {
                    return (
                      <MealAccordion
                        title={formatDateByDayAndMonth(item?.date)}
                        id={item?.date}
                        meals={item?.meals}
                      />
                    );
                  }}
                  keyExtractor={(item) => item?.date}
                />
              </>
            );
          }}
          keyExtractor={(item) => item?.month}
          ListEmptyComponent={
            !isGettingRecords && (
              <FallbackMessage
                customIcon={
                  <IconDataNotFound
                    color={$secondary}
                    width={100}
                    height={100}
                  />
                }
                title="Nenhum registro encontrado"
                subtitle="Tente selecionar uma data diferente!"
              />
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default RegistersScreeen;
