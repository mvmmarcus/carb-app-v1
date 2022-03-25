import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({ width, optionsLenght = 1 }) =>
  EStyleSheet.create({
    navContainer: {
      flex: 1,
      height: '$xxlarge',
      flexDirection: 'row',
      borderRadius: '0.5rem',
      borderWidth: 1.5,
      borderColor: '$secondary',
      overflow: 'hidden',
    },
    navButton: {
      backgroundColor: '$white',
      borderRadius: 0,
      flex: 1,
      width: (width - 32) / optionsLenght, // 32 => screen horizontal padding
    },
    activeNavButton: {
      flex: 1,
      backgroundColor: '$primary',
      borderRadius: 0,
      width: (width - 32) / optionsLenght,
    },
    navButtonLabel: {
      fontSize: '$small',
      marginVertical: 0,
      marginHorizontal: 0,
      color: '$white',
      fontWeight: '600',
      color: '$secondary',
      width: '100%',
      lineHeight: '2rem',
    },
    activeNavButtonLabel: {
      fontSize: '$small',
      marginVertical: 0,
      marginHorizontal: 0,
      fontWeight: '600',
      color: '$white',
      width: '100%',
      lineHeight: '2rem',
    },
    navDiviser: {
      width: 1.5,
      height: '100%',
      backgroundColor: '$secondary',
    },
  });
