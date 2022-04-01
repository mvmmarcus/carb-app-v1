import React, { useContext, useState, useCallback, useEffect } from 'react';
import { FlatList, View } from 'react-native';

import IconFA from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-select-dropdown';
import uuid from 'react-native-uuid';

import FallbackMessage from '../../components/FallbackMessage';
import IconDataNotFound from '../../../assets/data_not_found.svg';
import MealAccordion from '../../components/MealAccordion';
import ScreenWrapper from '../../components/ScreenWrapper';
import CustomText from '../../components/CustomText';
import BluetoothContext from '../../contexts/bluetooth';
import UserContext from '../../contexts/user';
import { sortByDate, monthNames, sortByMonth } from '../../utils/date';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const RegistersScreeen = ({ navigation }) => {
  const styles = getStyle({});
  const { $secondary } = theme;
  const [year, setYear] = useState('2022');
  const [filterYears, setFilterYears] = useState([]);
  const { bloodGlucoses } = useContext(BluetoothContext);
  const { insulinParams } = useContext(UserContext);

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
        id: uuid.v4(),
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
        id: uuid.v4(),
        month: Number(month) - 1, // 0 => jan, 1 => fev
        monthName: monthNames[Number(month) - 1],
        dates: monthGroups[month],
      };
    });

    return groupArraysByMonth || [];
  };

  const filterBloodGlucosesByMonth = (bloodGlucoses = []) => {
    const formattedBloodGlucoses = bloodGlucoses?.map((item) => {
      return {
        ...item,
        id: uuid.v4(),
        time: item?.time?.slice(0, 5),
        glucose: item?.value,
      };
    });

    return groupMealsByMonth(formattedBloodGlucoses);
  };

  const formatDateByDayAndMonth = (selectedDate) => {
    const date = new Date(selectedDate);
    const day = date?.getDate();
    const month = monthNames[date?.getMonth()];
    const formattedDate = `${day} de ${month}`;

    return formattedDate;
  };

  const getYearFilterValues = (bloodGlucoses) => {
    const filterYears = [];

    bloodGlucoses?.forEach((glucose) => {
      const currentYear = glucose?.date?.slice(0, 4);
      if (!filterYears?.includes(currentYear)) {
        filterYears.push(currentYear);
      }
    });
    return filterYears?.sort((a, b) => b - a);
  };

  useEffect(() => {
    const filterValues = getYearFilterValues(bloodGlucoses);
    setFilterYears(filterValues);
    setYear(filterValues[0]);
  }, [bloodGlucoses]);

  const mealsByMonth = filterBloodGlucosesByMonth(
    bloodGlucoses?.filter((item) => item?.date?.includes(year))
  );

  const dailyBloodGlucoses = useCallback(({ item }) => {
    return (
      <MealAccordion
        title={formatDateByDayAndMonth(item?.date)}
        id={item?.date}
        meals={item?.meals}
        key={item?.id}
        insulinParams={insulinParams}
      />
    );
  }, []);

  const dailyBloodGlucosesKey = useCallback((item) => item?.id, []);

  const monthlyBloodGlucoses = useCallback(({ item }) => {
    return (
      <React.Fragment key={item?.id}>
        <CustomText weight="bold" style={styles.registerTitle}>
          {item?.monthName}
        </CustomText>
        <FlatList
          data={item?.dates?.sort(sortByDate)}
          renderItem={dailyBloodGlucoses}
          keyExtractor={dailyBloodGlucosesKey}
        />
      </React.Fragment>
    );
  }, []);

  const monthlyBloodGlucosesKey = useCallback((item) => item?.id, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {mealsByMonth?.length > 0 && (
          <DropDownPicker
            renderDropdownIcon={() => (
              <IconFA name="caret-down" color={$secondary} size={20} />
            )}
            defaultValue={filterYears[0]}
            data={filterYears}
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
          renderItem={monthlyBloodGlucoses}
          keyExtractor={monthlyBloodGlucosesKey}
          ListEmptyComponent={
            <FallbackMessage
              customIcon={
                <IconDataNotFound color={$secondary} width={100} height={100} />
              }
              title="Nenhum registro encontrado"
              subtitle="Tente selecionar uma data diferente!"
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default RegistersScreeen;
