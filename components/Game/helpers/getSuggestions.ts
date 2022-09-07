import foods from 'data/foods';
import { Food } from 'data/types/Food';
import GuessResult from 'data/types/GuessResult';

const getSuggestions = (guesses: GuessResult[], value: string): Food[] =>
  foods
    .filter(
      (food) =>
        food.name.includes(value.toLowerCase()) &&
        !guesses.find((g) => g.guess.toLowerCase() === food.name.toLowerCase())
    )
    .sort((a, b) => a.name.indexOf(value) - b.name.indexOf(value))
    .slice(0, 5)
    .reverse();

export default getSuggestions;
