import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: '$small',
    },
    avatarContainer: {
      alignItems: 'center',
      flexDirection: 'column',
      marginBottom: '$xxsmall',
    },
    avatar: {
      backgroundColor: '$secondary',
      marginBottom: '$xxsmall',
    },
    avatarLabel: {
      fontSize: '$large',
      fontWeight: 'bold',
    },
    userName: { fontSize: '$medium', color: 'white' },
    menuOption: { paddingHorizontal: '$large', marginTop: '$small' },
  });
