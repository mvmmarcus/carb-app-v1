/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { Title, Caption } from 'react-native-paper';
import styled from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  padding: 20px 10px;
`;

export const LoadingSection = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 10px;
`;

export const CustomText = styled.Text`
  color: black;
  margin-right: 10px;
`;

export const ResultsLabel = ({ children }) => (
  <Title style={{ textAlign: 'center', marginBottom: 20 }}>{children}</Title>
);

export const CenteredTitle = ({ children }) => (
  <Title style={{ textAlign: 'center' }}>{children}</Title>
);

export const CenteredCaption = ({ children }) => (
  <Caption style={{ textAlign: 'center' }}>{children}</Caption>
);
