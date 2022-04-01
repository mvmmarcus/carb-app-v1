import React, { useState } from 'react';
import { View } from 'react-native';

import IconDataNotFound from '../../../assets/data_not_found.svg';
import IconFA from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';

import CustomText from '../CustomText';
import { convertNumberToString, getBackgroundColor } from '../../utils/global';
import { weekDays } from '../../utils/date';

import { getStyle } from './styles';
import { theme } from '../../styles/theme';

const GlucoseChart = ({
  width = 350,
  height = 250,
  data = {
    labels: [],
    datasets: [],
  },
  onDateChange = () => null,
  insulinParams = null,
}) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
    labelValue: '',
  });
  const styles = getStyle({});
  const { $white, $secondary, $primary } = theme;

  const handleChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;

    setShowDatePicker(false);
    setDate(currentDate);
    setTooltipPos({ visible: false });

    !!onDateChange && onDateChange(currentDate);
  };

  const formatDate = (selectedDate) => {
    const date = new Date(selectedDate);

    const weekDay = weekDays[date?.getDay()];
    const day = convertNumberToString(date?.getDate());
    const month = convertNumberToString(date?.getMonth() + 1);
    const fullYear = date?.getFullYear();
    const formattedDate = `${weekDay}, ${day}/${month}/${fullYear}`;

    return formattedDate;
  };

  return (
    <View style={styles.container}>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleChangeDate}
        />
      )}
      <View style={styles.header}>
        <Button
          onPress={() => setShowDatePicker(true)}
          uppercase={false}
          mode="contained"
          style={styles.filterButton}
          labelStyle={styles.filterButtonLabel}
        >
          <CustomText weight="bold" style={styles.day}>
            {formatDate(date)}{' '}
          </CustomText>
          <IconFA name="caret-down" size={20} color={$white} />
        </Button>
        {data.labels?.length > 0 && (
          <CustomText weight="bold" style={styles.unity}>
            mg/dL
          </CustomText>
        )}
      </View>

      {data.labels?.length > 0 ? (
        <LineChart
          style={{ marginBottom: data.datasets[0]?.data.length > 4 ? 20 : 0 }}
          data={data}
          width={width}
          height={height}
          fromZero
          verticalLabelRotation={data.datasets[0]?.data.length > 4 ? 45 : 0}
          withOuterLines={true}
          withInnerLines={false}
          withShadow={false}
          xLabelsOffset={data.datasets[0]?.data.length > 4 ? -10 : 0}
          formatYLabel={(value) => (data.datasets?.length ? value : '')}
          chartConfig={{
            backgroundGradientFrom: 0,
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0,
            color: () => $secondary,
            labelColor: () => $white,
            propsForLabels: {
              fontSize: 14,
              fontWeight: 'bold',
              alignmentBaseline: 'middle',
              disabled: true,
            },
            strokeWidth: '1',
            propsForDots: {
              r: '6',
            },
          }}
          bezier
          decorator={() => {
            return tooltipPos.visible ? (
              <View>
                <Svg>
                  <Rect
                    x={tooltipPos.x + 10}
                    y={tooltipPos.y - 15}
                    width="30"
                    height="40"
                    fill={$primary}
                  />
                  <TextSVG
                    x={tooltipPos.x + 25}
                    y={tooltipPos.y}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {tooltipPos.value}
                  </TextSVG>
                  <TextSVG
                    x={tooltipPos.x + 25}
                    y={tooltipPos.y + 10}
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    mg/dL
                  </TextSVG>
                  <TextSVG
                    x={tooltipPos.x + 25}
                    y={tooltipPos.y + 20}
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {tooltipPos.labelValue}
                  </TextSVG>
                </Svg>
              </View>
            ) : null;
          }}
          getDotColor={(dataPoint) => {
            return getBackgroundColor(dataPoint, insulinParams?.targetRange);
          }}
          onDataPointClick={(clickedData) => {
            const labels = data.labels;
            const clickedDataLabel = labels[clickedData.index];
            const isSamePoint =
              tooltipPos.x === clickedData.x && tooltipPos.y === clickedData.y;

            isSamePoint
              ? setTooltipPos((previousState) => {
                  return {
                    ...previousState,
                    value: clickedData.value,
                    visible: !previousState.visible,
                  };
                })
              : setTooltipPos({
                  x: clickedData.x,
                  value: clickedData.value,
                  y: clickedData.y,
                  visible: true,
                  labelValue: clickedDataLabel,
                });
          }}
        />
      ) : (
        <View style={styles.dataNotFoundContainer}>
          <IconDataNotFound color={$secondary} width={100} height={100} />
          <CustomText weight="bold" style={styles.dataNotFoundTitle}>
            Nenhum resultado encontrado
          </CustomText>
          <CustomText style={styles.dataNotFoundSubtitle}>
            Tente selecionar uma data diferente!
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default GlucoseChart;
