import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: '$small',
    },
    userName: {
      color: '$white',
      fontSize: '$medium',
      marginBottom: '$small',
    },
    conectMeterBox: {
      marginTop: '$medium',
    },
    infosBox: {
      marginVertical: '$medium',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
