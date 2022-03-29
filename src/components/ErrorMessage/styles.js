import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  container: {
    width: '100%',
    padding: '$small',
    backgroundColor: '$red',
    borderRadius: '$xxsmall',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'red',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingHorizontal: '$small',
  },
  errorTitle: {
    fontSize: '$small',
    color: '$white',
  },
  errorSubtitle: {
    fontSize: '$xsmall',
    color: '$white',
  },
  alertIcon: {
    color: '$white',
  },
  closeIcon: {
    color: '$white',
  },
});
