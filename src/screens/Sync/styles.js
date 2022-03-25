import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: '$small',
    },
    content: {
      flex: 1,
    },
    navContainer: {
      marginBottom: '$xlarge',
    },
  });
