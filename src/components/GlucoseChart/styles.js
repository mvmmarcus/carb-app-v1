import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      backgroundColor: '$primary',
      borderRadius: '$xxsmall',
      elevation: 8,
      paddingTop: '$xxsmall',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 16,
    },
    dataNotFoundContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '$xxxlarge',
      height: '15rem',
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
    titleContainer: {
      padding: '$small',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    day: {
      color: '$white',
      fontSize: '$small',
      marginRight: '$xsmall',
      flexDirection: 'row',
      alignItems: 'center',
    },
    unity: {
      color: '$white',
    },
    filterButton: {
      borderRadius: '0.5rem',
      alignSelf: 'flex-end',
      backgroundColor: '$primary',
      elevation: 0,
      alignItems: 'flex-end',
    },
    filterButtonLabel: {
      fontSize: '$small',
      color: '$white',
    },
  });
