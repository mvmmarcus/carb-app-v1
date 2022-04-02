import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    gradient: {
      paddingTop: '3.5rem',
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      alignItems: 'flex-start',
      paddingHorizontal: '$small',
      paddingBottom: '3rem',
    },
    text: {
      alignSelf: 'center',
      color: '$white',
    },
    alert: {
      color: '$white',
      alignSelf: 'center',
      marginVertical: '$small',
      fontSize: '$small',
    },
  });
