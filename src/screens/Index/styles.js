import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  gradient: {
    paddingTop: '$medium',
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '$small',
    maxWidth: '27rem',
    paddingBottom: '$medium',
  },
  logo: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '$small',
  },
  hero: {
    marginTop: '5rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: '$medium',
    color: '#ffffff',
    marginTop: '$medium',
    flex: 1,
  },
  buttonGroup: { width: '100%' },
  terms: {
    textAlign: 'center',
    fontSize: '$xsmall',
    color: '$white',
    marginTop: '$small',
  },
  link: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: '$xsmall',
    color: '$secondary',
  },
});
