import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: '$secondary',
      padding: '$small',
      borderRadius: '0.5rem',
      elevation: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    textContainer: {
      marginLeft: '$xsmall',
      paddingRight: '$xxsmall',
      justifyContent: 'center',
      flex: 1,
    },
    title: {
      color: '$white',
      fontSize: '$small',
    },
    subtitle: {
      color: '$white',
      fontSize: '$xsmall',
    },
    actionButton: {
      backgroundColor: '$primary',
      borderRadius: '0.5rem',
      marginLeft: '$xsmall',
    },
    actionButtonLabel: {
      fontSize: '$xsmall',
      color: '$white',
    },
  });
