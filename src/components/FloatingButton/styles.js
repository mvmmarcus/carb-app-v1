import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      position: 'absolute',
      marginHorizontal: '$small',
      marginVertical: '4rem',
      right: 0,
      bottom: 0,
      width: '3.5rem',
      height: '3.5rem',
      backgroundColor: '$secondary',
      elevation: '$xsmall',
      borderWidth: '0.125rem',
      borderColor: '$primary',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
