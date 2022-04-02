import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({ width }) =>
  EStyleSheet.create({
    container: {
      width,
      height: '100%',
      borderTopLeftRadius: '$small',
      borderTopRightRadius: '$small',
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: '$primary',
      overflow: 'hidden',
    },

    scrollArea: {
      flex: 1,
      paddingHorizontal: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      position: 'relative',
    },
    scrollAreaContent: {
      flex: 1,
    },
    header: {
      backgroundColor: '$white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      height: '$xxxlarge',
    },
    closeButton: { position: 'absolute', right: 0 },
    headerTitle: {
      color: '$secondary',
      fontSize: '$small',
      lineHeight: '$medium',
    },
    content: {
      paddingHorizontal: '$small',
      paddingTop: '$medium',
      paddingBottom: '4.5rem',
      flexDirection: 'column',
      justifyContent: 'center',
      flexGrow: 1,
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
    calcButton: {
      width: '100%',
      marginTop: '$xxsmall',
    },
    saveButton: {
      width: '50%',
      marginTop: '$xxsmall',
      alignSelf: 'flex-end',
    },
    button: {
      backgroundColor: '$white',
      borderWidth: 2,
      borderColor: '$secondary',
      height: '$xxlarge',
      borderRadius: '$xxsmall',
      elevation: 0,
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
      borderColor: '$secondary',
    },
    diviser: {
      flex: 1,
      height: 1,
      backgroundColor: '$secondary',
    },
    accordionContainer: {
      marginVertical: '$small',
    },
    iconLeft: {
      marginRight: 0,
      width: 30,
      height: 30,
    },
    accordion: {
      backgroundColor: '$secondary',
      paddingVertical: 0,
      elevation: '$xxsmall',
    },
    accordionTitle: {
      color: '$white',
      fontWeight: 'bold',
      fontSize: '$small',
    },
    accordionDescription: {
      color: '$white',
      fontSize: '$small',
    },
    accordionItem: {
      backgroundColor: '$primary',
      paddingLeft: '$xsmall',
      paddingRight: '$xsmall',
      paddingVertical: '$xxsmall',
      flex: 1,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      elevation: 8,
    },
    food: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: '$xxsmall',
    },
    foodNameContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingRight: '$xxsmall',
    },
    foodName: {
      color: '$white',
      fontSize: '$small',
    },
    portionInputLabel: {
      paddingLeft: 0,
    },
    portionInputLabelText: {
      marginLeft: 0,
    },
    iconEdit: {
      alignSelf: 'center',
      margin: 0,
      padding: 0,
      fontWeight: 'bold',
    },
    iconDelete: {
      alignSelf: 'center',
      margin: 0,
      padding: 0,
      marginTop: '$xsmall',
    },
    iconGroup: {
      flexDirection: 'column',
      alignSelf: 'center',
      marginLeft: '$xxsmall',
    },
    fallbackContainer: {
      marginHorizontal: '$xxsmall',
    },
    bloodGlucoseInput: {
      height: '$xxlarge',
      width: '3.5rem',
      paddingHorizontal: '$small',
      marginRight: '$xxsmall',
      borderRadius: '$borderRadius',
      color: '$secondary',
      borderColor: '$secondary',
      borderWidth: 2,
      backgroundColor: '$white',
    },
    totalInsulin: {
      fontSize: '$medium',
      color: '$white',
    },
    customBloodGlucose: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    navContainer: {
      marginBottom: '$xlarge',
    },
  });
