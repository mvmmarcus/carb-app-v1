import axios from 'axios';

const GOOGLE_CLOUD_KEY = 'AIzaSyCWxKbpzoEs7H187W5i0GOTy2BFJcAU7U8';

const baseUrl = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_CLOUD_KEY}`;

export const translateText = async ({
  targetLang = 'en',
  sourceLang = 'pt',
  query = '',
}) => {
  // fix apple searching
  const appleQuerys = ['maca', 'maçã', 'maça'];

  let searchQuery = query;

  if (appleQuerys?.includes(query?.toLowerCase())) {
    searchQuery = 'apple';
  }

  const response = await axios({
    method: 'POST',
    url: `${baseUrl}&target=${targetLang}&source=${sourceLang}&q=${searchQuery}`,
  });

  return response;
};
