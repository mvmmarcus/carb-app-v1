import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  gradient: {
    paddingTop: '1.5rem',
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingVertical: '1.5rem',
    paddingHorizontal: '1rem',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  hero: {
    marginTop: '5rem',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: '1.5rem',
    color: '#ffffff',
    marginTop: '1.5rem',
  },
  buttonGroup: { width: '100%' },
});
