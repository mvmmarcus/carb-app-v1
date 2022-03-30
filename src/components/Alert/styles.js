import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    infoBox: {
      marginTop: '$small',
      borderRadius: '$xxsmall',
      alignSelf: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    title: {
      fontSize: '$small',
      color: '$white',
      marginRight: '$xxsmall',
    },
  });
