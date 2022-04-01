export const formatToBrazilianDate = (date) => {
  const splittedDate = date?.split('/');
  const day = splittedDate?.length && splittedDate[2];
  const month = splittedDate?.length && splittedDate[1];
  const year = splittedDate?.length && splittedDate[0];
  const brazilianDate = splittedDate?.length === 3 && `${day}/${month}/${year}`;

  return brazilianDate || '';
};

export const sortByDateAndTime = (a, b) => {
  return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
};

export const sortByDate = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};

export const sortByMonth = (a, b) => {
  return new Date(b.month) - new Date(a.month);
};

export const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const weekDays = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sab',
};
