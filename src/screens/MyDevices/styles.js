/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { Caption, Title } from 'react-native-paper';
import styled, { css } from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  padding: 10px;
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

export const BluetoothStatusText = ({ children }) => (
  <Title style={{ textAlign: 'center', marginBottom: 10 }}>{children}</Title>
);

export const CenteredCaption = ({ children }) => (
  <Caption style={{ textAlign: 'center' }}>{children}</Caption>
);

export const SelectDevice = ({ children }) => (
  <Caption style={{ textAlign: 'center', marginBottom: 10 }}>
    {children}
  </Caption>
);

export const FlatListStyled = styled.FlatList`
  margin-top: 10px;
  text-align: center;
`;

export const PeripheralWrapper = styled.View`
  ${({ isConnected, isTouchable }) => css`
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    color: white;
    background: ${isTouchable ? 'white' : isConnected ? 'green' : 'gray'};
    border: ${isConnected ? '1px solid green' : '1px solid gray'};
  `}
`;

export const PeripheralDescription = styled.Text`
  color: white;
`;
