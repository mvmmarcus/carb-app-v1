import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({ width, height }) =>
  EStyleSheet.create({
    overlay: {
      backgroundColor: 'black',
      opacity: 0.5,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: '$xxxlarge',
      paddingHorizontal: '$small',
    },
    modalView: {
      margin: '$small',
      backgroundColor: '$white',
      borderRadius: '$xxsmall',
      padding: '$small',
      width: '100%',
    },
    scrollView: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '$small',
    },
    modalHeaderTitle: {
      fontSize: '$small',
      color: '$secondary',
    },
    modalRow: {},
    modalSelectedRow: {
      backgroundColor: '$primary',
    },
    modalSelectedText: {
      color: '$white',
    },
    modalText: {
      color: 'black',
    },
    closeButton: {
      margin: 0,
      width: '$medium',
      height: '$medium',
    },
    table: {},
    cho: {
      flex: 0.3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    measure: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    loadingBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '$xsmall',
    },
    searchingText: {
      marginRight: '$xxsmall',
      color: '$secondary',
    },
  });
