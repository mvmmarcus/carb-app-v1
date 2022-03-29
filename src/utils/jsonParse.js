export const jsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`error on parsing value: ${value}:`, error);
    return null;
  }
};
