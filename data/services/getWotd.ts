import foods from 'data/foods';
import shuffleWithSeed from './shuffleWithSeed';

const getWotd = (date?: Date): typeof foods[number] => {
  const dateMs = date ? date.valueOf() : Date.now();
  const epochDays = Math.floor(dateMs / 1000 / 3600 / 24);

  const shuffledFoods = shuffleWithSeed(
    foods,
    parseInt(process.env.SEED || '0')
  );
  return shuffledFoods[epochDays % foods.length];
};

export default getWotd;
