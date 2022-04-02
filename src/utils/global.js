import { theme } from '../styles/theme';

export const getBackgroundColor = (value, targetRange = []) => {
  const { $red, $orange } = theme;

  const minTarget = targetRange[0];
  const maxTarget = targetRange[1];

  if ((value >= 0 && value <= 70) || value >= 140) {
    return $red;
  } else if (
    (value > 70 && value < minTarget) ||
    (value > maxTarget && value < 140)
  ) {
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

export const getInitialsOfName = (fullName = '') => {
  const nameInitials = fullName?.match(/\b(\w)/g);
  return nameInitials?.join('')?.slice(0, 2);
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

export const getTotal = (values = [], decimals = 0) => {
  if (values?.length) {
    const total = values?.reduce((total, curr) => total + curr);
    return total !== 'NaN' && !!total
      ? parseFloat(total?.toFixed(decimals))
      : 0;
  } else {
    return 0;
  }
};

export const convertNumberToString = (value) =>
  value?.toString()?.padStart(2, '0');
