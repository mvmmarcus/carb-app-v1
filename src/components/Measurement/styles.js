/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text } from 'react-native';
import { Title, Caption } from 'react-native-paper';
import styled, { css } from 'styled-components/native';

export const Wrapper = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-left: 10px;
  margin-bottom: 10px;
`;

export const ValueCircle = styled.View`
  ${({ color }) => css`
    width: 70px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${color};
    border-radius: 100px;
    margin-right: 10px;
    color: red;
  `}
`;

export const Value = ({ children }) => (
  <Title
    style={{
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'white',
      margin: 0,
      padding: 0,
      lineHeight: 20,
      marginVertical: 0,
      letterSpacing: 0,
    }}
  >
    {children}
  </Title>
);

export const ValueUnit = ({ children }) => (
  <Caption style={{ color: 'white', lineHeight: 12 }}>{children}</Caption>
);

export const Time = ({ children }) => (
  <Caption style={{ lineHeight: 12, marginVertical: 0 }}>{children}</Caption>
);
