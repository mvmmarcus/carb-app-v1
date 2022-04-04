import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({ glucoseBadgeBg }) => {
  const badge = {
    backgroundColor: '$white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: '0.375rem',
    elevation: '$xxsmall',
    height: '$xlarge',
    minWidth: '$xxxlarge',
    paddingHorizontal: '0.625rem',
  };
  return EStyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    timeBox: {
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      minWidth: '2.25rem',
      maxWidth: '2.25rem',
    },
    mealType: {
      fontSize: '$xxsmall',
      color: '$white',
      fontStyle: 'italic',
    },
    mealHour: {
      fontSize: '$xsmall',
      color: '$white',
    },
    diviserBox: {
      backgroundColor: '$secondary',
      width: 1,
      position: 'relative',
      marginHorizontal: '$xsmall',
      justifyContent: 'center',
      alignItems: 'center',
    },
    diviserLine: {
      position: 'absolute',
      backgroundColor: '$secondary',
      top: 0,
      bottom: 0,
      width: 1.5,
    },
    diviserCircle: {
      position: 'absolute',
      backgroundColor: '$white',
      width: '0.625rem',
      height: '0.625rem',
      borderRadius: 100,
      borderColor: '$secondary',
      borderWidth: 1.5,
    },
    mealInfosBox: {
      flexDirection: 'row',
      paddingVertical: '$xxsmall',
    },
    mealInfosBoxContentScroll: {
      justifyContent: 'space-between',
    },
    mealItem: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mealItemTitle: {
      fontSize: '$xsmall',
      color: '$white',
      marginBottom: '0.25rem',
    },
    mealItemBadge: badge,
    mealItemGlucoseBdge: {
      ...badge,
      backgroundColor: glucoseBadgeBg,
    },
    mealItemValue: {
      fontSize: '$medium',
      marginRight: '0.25rem',
      marginTop: '0.175rem',
      marginBottom: 0,
    },
    mealItemUnity: {
      fontSize: '0.625rem',
      alignSelf: 'flex-end',
      marginBottom: '0.175rem',
    },
    iconEdit: {
      alignSelf: 'center',
      margin: 0,
      padding: 0,
      marginLeft: '$xxsmall',
    },
  });
};
