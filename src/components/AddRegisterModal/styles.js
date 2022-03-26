import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({ width }) =>
  EStyleSheet.create({
    container: {
      width,
      height: '100%',
      borderTopLeftRadius: '$small',
      borderTopRightRadius: '$small',
      alignSelf: 'center',
      backgroundColor: '$primary',
      overflow: 'hidden',
    },
    scrollArea: {
      flex: 1,
      paddingHorizontal: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    header: {
      backgroundColor: '$white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      height: '$xxxlarge',
    },
    closeButton: { position: 'absolute', left: 0 },
    headerTitle: {
      color: '$secondary',
      fontSize: '$small',
      lineHeight: '$medium',
    },
    content: {
      paddingHorizontal: '$small',
      paddingVertical: '$medium',
    },
    text: {
      fontSize: '$small',
      lineHeight: '$medium',
      color: '$white',
    },
    timeContainer: {
      flexDirection: 'column',
      marginBottom: '$medium',
    },
    button: {
      backgroundColor: '$white',
      borderWidth: 2,
      borderColor: '$secondary',
      height: '$xxlarge',
      borderRadius: '$xxsmall',
    },
    buttonFullWidth: {
      backgroundColor: '$white',
      borderWidth: 2,
      borderColor: '$secondary',
      height: '$xxlarge',
      borderRadius: '$xxsmall',
      flex: 1,
    },
    buttonContent: {
      height: '100%',
      paddingHorizontal: 0,
    },
    buttonLabel: {
      marginVertical: 0,
      marginLeft: '$xxsmall',
      color: '$secondary',
      fontSize: '$xsmall',
    },
    buttonsRow: {
      flexDirection: 'row',
    },
    dropdownRowText: {
      color: '$secondary',
      fontSize: '$xsmall',
    },
    dropdownRow: {
      backgroundColor: '$white',
      height: '$xxlarge',
    },
    infoRow: {
      padding: '$small',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    infoContainer: {
      marginTop: '$xxsmall',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '$secondary',
    },
    diviser: {
      flex: 1,
      height: 1,
      backgroundColor: '$secondary',
    },
  });
