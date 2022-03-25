import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: '$small',
    },
    conectMeterBox: {
      marginVertical: '$medium',
    },
    infosBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
