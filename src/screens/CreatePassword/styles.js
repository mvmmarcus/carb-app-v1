import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  gradient: {
    paddingTop: '5rem',
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '$small',
    paddingBottom: '$xxxlarge',
  },
  titleGroup: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '$medium',
    color: '$white',
    lineHeight: 36,
  },
  subTitle: {
    fontSize: '$small',
    lineHeight: 24,
    marginTop: '$xxsmall',
    color: '$white',
  },
  formGroup: { width: '100%', marginBottom: '$xlarge', marginTop: '$xlarge' },
  buttonGroup: { width: '100%' },
});
