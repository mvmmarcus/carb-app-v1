import React from 'react';
import { Text } from 'react-native';

const CustomText = ({ children, style, weight = 'regular', ...props }) => {
  const fontStyle = {
    light: {
      fontFamily: 'Poppins-Light',
    },
    regular: {
      fontFamily: 'Poppins-Regular',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
    },
    bold: {
      fontFamily: 'Poppins-SemiBold',
    },
  };

  return (
    <Text
      style={{
        ...style,
        fontFamily: fontStyle[weight].fontFamily,
      }}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
