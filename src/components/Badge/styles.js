import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '$white',
      elevation: '$xxsmall',
      borderRadius: '$xxsmall',
      paddingVertical: '$xsmall',
      paddingHorizontal: '$small',
      maxWidth: '5.5rem',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: '$xsmall',
      color: '$secondary',
    },
    subtitle: {
      textAlign: 'center',
      fontSize: '$xsmall',
      color: '$secondary',
    },
    value: {
      textAlign: 'center',
      fontSize: '$medium',
      color: '$secondary',
    },
    diviserValue: {
      textAlign: 'center',
      fontSize: '1.125rem',
      color: '$secondary',
      lineHeight: '1.5rem',
    },
    diviser: {
      backgroundColor: '$secondary',
      height: '0.125rem',
    },
  });
