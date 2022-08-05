import foods from '@data/foods';

const getWotd = (): typeof foods[number] => {
  const date = Date.now();
  const epochDays = Math.floor(date / 1000 / 3600 / 24);
  return foods[epochDays % foods.length];
};

export default getWotd;
