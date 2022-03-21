import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      elevation: 0,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: '$small',
    },
    title: {
      color: '$white',
      fontSize: '$medium',
    },
  });
