import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({ width, SEPARATOR_WIDTH }) =>
  EStyleSheet.create({
    gradient: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: '$xxlarge',
    },

    slider: {
      width: '100%',
      flex: 1,
    },
    sliderHeader: {
      width: '100%',
      paddingHorizontal: SEPARATOR_WIDTH * 2.5,
      marginBottom: '$xxsmall',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    sliderContent: {
      flex: 1,
      width: '100%',
    },
    sliderItem: {
      width: width - SEPARATOR_WIDTH * 4,
      flexDirection: 'column',
      backgroundColor: '$primary',
      borderRadius: '$xxsmall',
      padding: '$medium',
    },
    question: {
      flex: 1,
      display: 'flex',
    },
    questionText: {
      color: '$white',
      fontSize: '$small',
      textAlign: 'center',
      marginBottom: '$medium',
    },
    optionsList: {
      height: 1,
      flex: 1,
    },
    optionContent: {
      justifyContent: 'center',
      flex: 1,
    },
    buttonGroup: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      marginTop: '$medium',
    },
  });
