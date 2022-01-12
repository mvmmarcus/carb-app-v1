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
});
