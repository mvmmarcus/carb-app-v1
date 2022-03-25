import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      marginBottom: 16,
    },
    iconLeft: {
      marginRight: 0,
      width: 30,
      height: 30,
    },
    accordion: {
      backgroundColor: '$secondary',
      paddingVertical: 0,
      elevation: 8,
    },
    accordionTitle: {
      color: '$white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    accordionItem: {
      backgroundColor: '$primary',
      paddingLeft: '$xsmall',
      paddingRight: '$xsmall',
      paddingVertical: '$xxsmall',
      flex: 1,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      elevation: 8,
    },
  });
