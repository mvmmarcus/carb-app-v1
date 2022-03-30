import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    infoBox: {
      width: '80%',
      backgroundColor: '$white',
      padding: '$small',
      borderRadius: '$xxsmall',
      alignSelf: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: '$small',
      color: '$secondary',
    },
    subtitle: {
      fontSize: '$xsmall',
      marginBottom: '$xxsmall',
      color: '$secondary',
      textAlign: 'center',
    },
    iconLoading: {
      color: '$secondary',
    },
  });
