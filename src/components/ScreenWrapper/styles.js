import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    gradient: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: '$large',
      paddingBottom: '$xxxlarge',
    },
  });
