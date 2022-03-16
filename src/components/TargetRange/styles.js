import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      justifyContent: 'center',
      flex: 1,
      alignItems: 'center',
    },
    title: {
      color: '$white',
      marginBottom: '$xxlarge',
      fontSize: '$small',
    },
    track: {
      backgroundColor: '$white',
      height: '0.2rem',
    },
    selected: {
      backgroundColor: '$secondary',
    },
    marker: {
      backgroundColor: '$secondary',
      width: '$small',
      height: '$small',
    },
    unit: {
      alignSelf: 'flex-end',
      margin: 0,
      color: '$secondary',
      fontWeight: '700',
    },
    arrowContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      marginVertical: '$small',
      alignItems: 'center',
    },
    maxMinValueContainer: {
      flexDirection: 'column',
      marginHorizontal: '$xxsmall',
    },
    maxMinValueTitle: {
      color: '$white',
    },
    maxMinValue: {
      color: '$red',
    },
  });
