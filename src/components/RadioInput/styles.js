import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({});

export const getStyle = ({ size, color, labelSize }) => {
  return EStyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    button: {
      height: size,
      width: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonChecked: {
      height: size / 2,
      width: size / 2,
      borderRadius: size / 4,
      backgroundColor: color,
    },
    label: {
      fontSize: labelSize,
      lineHeight: labelSize * 0.75,
      paddingTop: labelSize * 0.75,
      color: color,
      marginLeft: '$xxsmall',
    },
  });
};
