import EStyleSheet from 'react-native-extended-stylesheet';

export const getStyle = ({
  color = '$black',
  labelColor = '$white',
  borderColor = '$primary',
  labelSize = 16,
  paddingRight,
  ...props
}) => {
  return EStyleSheet.create({
    default: {
      height: '$xxxlarge',
      paddingHorizontal: '$small',
      paddingRight,
      borderRadius: '$borderRadius',
      color,
      borderColor,
      borderWidth: 2,
      backgroundColor: '$white',
    },
    labelGroup: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '0.25rem',
      paddingLeft: '$xsmall',
    },
    label: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: labelSize,
      lineHeight: labelSize * 0.75,
      paddingTop: labelSize * 0.75,
      marginLeft: '$xxsmall',
      color: labelColor,
    },
    inputContainer: {
      position: 'relative',
      ...props,
    },
    iconInput: {
      position: 'absolute',
      right: '$small',
      bottom: '$xsmall',
    },
  });
};
