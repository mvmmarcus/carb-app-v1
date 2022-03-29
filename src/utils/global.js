import { theme } from '../styles/theme';

export const getBackgroundColor = (value) => {
  const { $red, $orange } = theme;

  if ((value >= 0 && value < 60) || value > 150) {
    return $red;
  } else if ((value >= 50 && value < 80) || (value >= 120 && value < 150)) {
    return $orange;
  } else {
    return 'green';
  }
};

export const getCaptalizedFirstName = (fullName = '') => {
  let captalizedFirstName = fullName?.split(' ')[0];
  captalizedFirstName =
    captalizedFirstName?.charAt(0)?.toUpperCase() +
    captalizedFirstName?.slice(1);
  return captalizedFirstName;
};
