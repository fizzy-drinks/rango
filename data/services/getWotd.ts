import foods from '@data/foods';

const getWotd = (date?: Date): typeof foods[number] => {
  const dateMs = date ? date.valueOf() : Date.now();
  const epochDays = Math.floor(dateMs / 1000 / 3600 / 24);
  return foods[epochDays % foods.length];
};

export default getWotd;
