import foods from 'data/foods';
import GuessResult from 'data/types/GuessResult';
import getIngredientsResults from './getIngredientsResults';
import getWotd from './getWotd';

const getGuessResult = (guess: string): GuessResult => {
  const wotd = getWotd();
  const guessedFood = foods.find(
    (f) => f.name.toLowerCase() === guess?.toLowerCase()
  );

  if (!guessedFood) {
    return {
      guess,
      result: 'wrong',
      ingredients: [],
      missing: wotd.ingredients.length,
    };
  }

  const ingredients = getIngredientsResults(guessedFood, wotd);
  const missing = wotd.ingredients.filter(
    (ingredient) => !guessedFood.ingredients.includes(ingredient)
  ).length;

  return {
    guess,
    result: wotd.name === guess ? 'jackpot' : 'wrong',
    ingredients,
    missing,
  };
};

export default getGuessResult;
