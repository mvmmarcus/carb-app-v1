export const getBackgroundColor = (value) => {
  if ((value >= 0 && value < 60) || value > 150) {
    return 'red';
  } else if ((value >= 50 && value < 80) || (value >= 120 && value < 150)) {
    return 'orange';
  } else {
    return 'green';
  }
};

export const sortByDate = (a, b) => {
  return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
};