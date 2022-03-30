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

export const getAverageValue = ({ values = [], decimals = 0 }) => {
  if (values?.length) {
    const average = (
      values?.reduce((a, b) => a + b, 0) / values?.length
    )?.toFixed(decimals);
    return average !== 'NaN' ? average : 0;
  } else {
    return 0;
  }
};

export const getTotal = (values = []) => {
  if (values?.length) {
    const total = values?.reduce((total, curr) => total + curr);
    return total !== 'NaN' ? total : 0;
  } else {
    return 0;
  }
};
