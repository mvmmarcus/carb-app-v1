/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { Title, Caption } from 'react-native-paper';
import styled from 'styled-components/native';

export const WrapperModal = styled.View`
  padding: 20px;
  background: white;
`;

export const TitleModal = ({ children }) => (
  <Title
    style={{
      marginRight: 10,
      textAlign: 'center',
    }}
  >
    {children}
  </Title>
);

export const ContentModal = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Description = ({ children }) => (
  <Caption
    style={{
      marginRight: 10,
      textAlign: 'center',
    }}
  >
    {children}
  </Caption>
);
