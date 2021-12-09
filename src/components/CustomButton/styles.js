import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  text: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  primary: {
    height: '3rem',
    borderRadius: '$borderRadius',
    backgroundColor: '$white',
    justifyContent: 'center',
    color: '$secondary',
  },
  secondary: {
    height: '3rem',
    borderRadius: '$borderRadius',
    backgroundColor: '$secondary',
    justifyContent: 'center',
    color: '$white',
  },
  outlined: {
    height: '3rem',
    borderRadius: '$borderRadius',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: '$white',
    borderWidth: 2,
    borderColor: '$white',
  },
});
