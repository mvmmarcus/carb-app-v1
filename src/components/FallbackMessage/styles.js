import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    fallbackContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fallbackTitle: {
      fontSize: '1.125rem',
      color: '$secondary',
      textAlign: 'center',
    },
    fallbackSubtitle: {
      color: '$secondary',
      textAlign: 'center',
      fontSize: '$xsmall',
      maxWidth: '22rem',
    },
  });
