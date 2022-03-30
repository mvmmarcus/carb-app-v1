import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: '$small',
      position: 'relative',
    },
    registerTitle: {
      color: '$white',
      fontSize: '1.25rem',
      marginTop: '$xxsmall',
    },
    filterButton: {
      borderRadius: '0.5rem',
      alignSelf: 'flex-end',
      backgroundColor: '$primary',
      elevation: 8,
      width: '6rem',
      height: '$xxlarge',
    },
    filterButtonLabel: {
      fontSize: '$small',
      fontWeight: '700',
      color: '$white',
      marginHorizontal: 0,
    },
    dataNotFoundTitle: {
      fontSize: '$small',
      color: '$secondary',
      textAlign: 'center',
    },
    dataNotFoundSubtitle: {
      color: '$secondary',
      textAlign: 'center',
      fontSize: '$xsmall',
    },
  });
