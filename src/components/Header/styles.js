/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import { Appbar } from 'react-native-paper';

export const HeaderContent = ({ children }) => (
  <Appbar.Content
    style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
    }}
    title={children}
  />
);
