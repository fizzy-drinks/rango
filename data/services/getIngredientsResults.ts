import { Food } from 'data/types/Food';

const getIngredientsResults = (
  guessedFood: Food,
  wotd: Food
): { name: string; correct: boolean }[] =>
  guessedFood.ingredients.map((ing) => ({
    name: ing,
    correct: wotd.ingredients.includes(ing),
  }));

export default getIngredientsResults;
