import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      backgroundColor: '$primary',
      borderRadius: '$xxsmall',
      elevation: 8,
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
  });
