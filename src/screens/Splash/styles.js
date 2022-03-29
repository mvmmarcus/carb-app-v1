import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({ width, height }) =>
  EStyleSheet.create({
    container: {
      width,
      height,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '$primary',
    },
    loadingIcon: {
      marginTop: '$xxxlarge',
    },
  });
