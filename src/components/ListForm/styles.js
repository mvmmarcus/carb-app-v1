import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({}) =>
  EStyleSheet.create({
    alert: {
      fontSize: '$xsmall',
      color: '$white',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '$xlarge',
    },
    list: {},
    row: {
      flexDirection: 'row',
      marginBottom: '$small',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: '$small',
    },
    input: {
      width: '$xlarge',
      backgroundColor: 'transparent',
      borderBottomWidth: '0.2rem',
      borderBottomColor: '$white',
      fontWeight: 'bold',
      color: '$white',
      fontSize: '$small',
      textAlign: 'center',
      padding: 0,
    },
    labelContainer: {
      textAlign: 'left',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    },
    text: {
      color: '$white',
      marginHorizontal: '0.4rem',
      fontSize: '$small',
    },
    subtext: {
      color: '$white',
      fontSize: '$xxsmall',
      marginHorizontal: '0.4rem',
    },
    marker: {
      marginHorizontal: '$small',
      backgroundColor: '$white',
      width: '0.3rem',
      height: '0.3rem',
      borderRadius: '$borderRadius',
      marginBottom: '$xxsmall',
    },
  });
