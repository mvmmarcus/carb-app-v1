import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    container: {
      padding: '$small',
      flexDirection: 'row',
      borderRadius: '$xxsmall',
      elevation: '$xxsmall',
      marginBottom: '$small',
      alignItems: 'center',
    },

    rssiBox: {
      width: '2.25rem',
      height: '2.25rem',
      borderRadius: '$xxsmall',
      paddingHorizontal: '$xxsmall',
      paddingVertical: '0.625rem',
      backgroundColor: '$primary',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rssiValue: {
      fontSize: '$xsmall',
      lineHeight: '$small',
      color: '$white',
      fontStyle: 'italic',
    },
    nameBox: {
      flex: 1,
      paddingHorizontal: '$xsmall',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    name: {
      fontSize: '$small',
      lineHeight: '1.25rem',
      color: '$white',
    },
    id: {
      fontSize: '$xsmall',
      lineHeight: '1.25rem',
      color: '$white',
    },
    connectButton: {
      borderRadius: '$xxsmall',
      marginLeft: '$xsmall',
      height: '$xlarge',
      paddingHorizontal: 0,
    },
    connectButtonContent: { height: '100%' },
    connectButtonLabel: {
      fontSize: '$xsmall',
      lineHeight: '$xsmall',
      color: '$white',
    },
  });
