import foods from 'data/foods';
import { Food } from 'data/types/Food';
import getConfig from 'next/config';
import shuffleWithSeed from './shuffleWithSeed';

const getWotd = (date?: Date): Food => {
  const dateMs = date ? date.valueOf() : Date.now();
  const epochDays = Math.floor(dateMs / 1000 / 3600 / 24);

  const { serverRuntimeConfig } = getConfig();
  const shuffledFoods = shuffleWithSeed(
    foods,
    parseInt(serverRuntimeConfig.gameSeed || '0')
  );
  return shuffledFoods[epochDays % foods.length];
};

export default getWotd;
