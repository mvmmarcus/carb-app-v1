import React, { useContext } from 'react';
import { FlatList, View } from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import Measurement from '../../components/Measurement';
import BluetoothContext from '../../contexts/bluetooth';
import { formatToBrazilianDate, sortByDate } from '../../utils/date';

import {
  SafeArea,
  Container,
  LoadingSection,
  CustomText,
  CenteredTitle,
  CenteredCaption,
} from './styles';

const MeasurementsScreeen = () => {
  const { isGettingRecords, records } = useContext(BluetoothContext);

  return (
    <SafeArea>
      <Container>
        {isGettingRecords && (
          <LoadingSection>
            <CustomText>Atualizando registros</CustomText>
            <ActivityIndicator animating={true} />
          </LoadingSection>
        )}

        <View>
          <FlatList
            data={records
              ?.sort(sortByDate)
              ?.filter((item) => item?.value >= 40)
              ?.slice(0, 19)}
            renderItem={({ item }) => (
              <Measurement
                value={item?.value}
                date={formatToBrazilianDate(item?.date)}
                time={item?.time}
              />
            )}
            keyExtractor={(item) => item?.fullDate}
            ListEmptyComponent={
              !isGettingRecords && (
                <CenteredTitle>Nenhum registro encontrado</CenteredTitle>
              )
            }
          />

          {records?.length > 0 && (
            <CenteredCaption>total: {records?.length}</CenteredCaption>
          )}
        </View>
      </Container>
    </SafeArea>
  );
};

export default MeasurementsScreeen;
