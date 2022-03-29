import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({
  color = '#00458F',
  backgroundColor = 'white',
  borderColor = 'white',
  fontSize = 16,
  width,
}) => {
  return EStyleSheet.create({
    contained: {
      width: width || '100%',
      height: '3rem',
      borderRadius: '$borderRadius',
      backgroundColor,
      color,
    },
    outlined: {
      width: width || '100%',
      height: '3rem',
      borderRadius: '$borderRadius',
      backgroundColor: backgroundColor || 'transparent',
      borderWidth: 2,
      color,
      borderColor,
    },
    disabled: {
      width: width || '100%',
      height: '3rem',
      borderRadius: '$borderRadius',
      backgroundColor: '$gray',
      color,
    },
    text: {
      fontSize: fontSize,
      lineHeight: 24,
      color,
    },
  });
};
