import foods from 'data/foods';

const getIngredientsResults = (
  guessedFood: typeof foods[number],
  wotd: typeof foods[number]
): { name: string; correct: boolean }[] =>
  guessedFood.ingredients.map((ing) => ({
    name: ing,
    correct: wotd.ingredients.includes(ing),
  }));

export default getIngredientsResults;
