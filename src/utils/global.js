import { theme } from '#/styles/theme';

export const getBackgroundColor = (value) => {
  const { $red, $orange, $primary } = theme;

  if ((value >= 0 && value < 60) || value > 150) {
    return $red;
  } else if ((value >= 50 && value < 80) || (value >= 120 && value < 150)) {
    return $orange;
  } else {
    return 'green';
  }
};
