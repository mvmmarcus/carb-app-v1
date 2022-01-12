import colors from './colors';
import fonts from './fonts';
import spacings from './spacings';

export const theme = {
  $theme: 'light',
  ...colors,
  ...spacings,
  ...fonts,
  $borderRadius: '0.5rem',
  $defaultTransition: '0.3s ease-in-out',
  $fastTransition: '0.1s ease-in-out',
};
