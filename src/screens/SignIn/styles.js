import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: '3rem',
    paddingHorizontal: '$small',
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '$xxxlarge',
    flex: 1,
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
