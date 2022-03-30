import axios from 'axios';

const USDA_KEY = 'zweoCBPwtjvRsdO4NzJ4ozPzRRf6Ex80MoGEk7cI';
const nutritionalFoodsDataType = 'Survey (FNDDS)';

const baseUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_KEY}&dataType=${nutritionalFoodsDataType}`;

export const getFoodsNutritionalInfos = async ({
  query = '',
  perPage = 10,
  page = 1,
}) => {
  console.log({ query, page });
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}&query=${query}&pageSize=${perPage}&pageNumber=${page}`,
  });

  return response;
};
