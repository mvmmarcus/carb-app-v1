import React, { useState } from 'react';
import { View } from 'react-native';

import { Title } from 'react-native-paper';

import Measurement from '../../components/Measurement';

import {
  CenteredTitle,
  Container,
  LastRecordView,
  ResultsLabel,
  SafeArea,
} from './styles';

const HomeScreen = () => {
  const [lastRecord, setLastRecord] = useState({
    value: 100,
    date: '2021/09/20',
    time: '19:50:30',
  });

  return (
    <SafeArea>
      <Container>
        <View style={{ flex: 1 }}>
          <Title>Grafico</Title>
        </View>
        <LastRecordView>
          {lastRecord ? (
            <>
              <ResultsLabel>Ultimo registro</ResultsLabel>
              <Measurement
                value={lastRecord?.value}
                date={lastRecord?.date}
                time={lastRecord?.time}
              />
            </>
          ) : (
            <CenteredTitle>Nenhum resultados encontrado</CenteredTitle>
          )}
        </LastRecordView>
      </Container>
    </SafeArea>
  );
};

export default HomeScreen;
