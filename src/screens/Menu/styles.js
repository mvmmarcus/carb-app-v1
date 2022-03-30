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
      borderWidth: '0.25rem',
      borderColor: '$primary',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarLabel: {
      fontSize: '$large',
      fontWeight: 'bold',
      lineHeight: '$xxxlarge',
    },
    userName: { fontSize: '$medium', color: 'white' },
    menuOption: { paddingHorizontal: '$large', marginTop: '$small' },
  });
