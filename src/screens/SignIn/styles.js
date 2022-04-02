import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '$small',
    paddingBottom: '$xxxlarge',
  },
  titleGroup: {
    width: '100%',
    alignItems: 'flex-start',
    paddingTop: '3rem',
    paddingHorizontal: '$small',
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
  description: {
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
  formGroup: {
    flex: 1,
    width: '100%',
    marginBottom: '$xlarge',
    marginTop: '$xlarge',
    justifyContent: 'center',
  },
  buttonGroup: { width: '100%' },
  radioGroup: {
    width: '100%',
    paddingLeft: '0.125rem',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
