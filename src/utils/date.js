export const formatToBrazilianDate = (date) => {
  const splittedDate = date?.split('/');
  const day = splittedDate?.length && splittedDate[2];
  const month = splittedDate?.length && splittedDate[1];
  const year = splittedDate?.length && splittedDate[0];
  const brazilianDate = splittedDate?.length === 3 && `${day}/${month}/${year}`;

  return brazilianDate || '';
};

export const sortByDate = (a, b) => {
  return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
};
