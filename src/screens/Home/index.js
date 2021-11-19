import React, { useContext } from 'react';
import { View } from 'react-native';

import { Title } from 'react-native-paper';

import Measurement from '../../components/Measurement';
import BluetoothContext from '../../contexts/bluetooth';
import { formatToBrazilianDate } from '../../utils/date';

import {
  Container,
  LastRecordView,
  ResultsLabel,
  SafeArea,
  CenteredCaption,
} from './styles';

const HomeScreen = () => {
  const { records } = useContext(BluetoothContext);
  const lastRecord = records[0];

  return (
    <SafeArea>
      <Container>
        <View style={{ flex: 1 }}>
          <Title>Grafico</Title>
        </View>
        <LastRecordView>
          <ResultsLabel>Ultimo registro</ResultsLabel>
          {lastRecord ? (
            <Measurement
              value={lastRecord?.value}
              date={formatToBrazilianDate(lastRecord?.date)}
              time={lastRecord?.time}
            />
          ) : (
            <CenteredCaption>Nenhum registro encontrado</CenteredCaption>
          )}
        </LastRecordView>
      </Container>
    </SafeArea>
  );
};

export default HomeScreen;
