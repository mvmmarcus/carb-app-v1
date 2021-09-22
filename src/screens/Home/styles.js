/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { Title } from 'react-native-paper';
import styled from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
`;

export const Text = styled.Text`
  color: black;
`;

export const ResultsLabel = ({ children }) => (
  <Title style={{ textAlign: 'center', marginBottom: 20 }}>{children}</Title>
);

export const CenteredTitle = ({ children }) => (
  <Title style={{ textAlign: 'center' }}>{children}</Title>
);

export const LastRecordView = styled.View`
  padding: 10px;
`;
