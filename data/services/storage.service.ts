import foods from 'data/foods';
import { Food } from 'data/types/Food';
import GuessResult from 'data/types/GuessResult';
import { add, format } from 'date-fns';
import { Cookie } from 'next-cookie';
import getIngredientsResults from './getIngredientsResults';
import getWotd from './getWotd';

const getDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

const getStoredGuesses = (cookie: Cookie, date: Date): string[] => {
  const stored: string = cookie.get(getDateKey(date)) || '';
  return stored.split(',') || [];
};

const StorageService = {
  getGuessesAtDate(date: Date, cookie: Cookie): GuessResult[] {
    const guesses = getStoredGuesses(cookie, date) || [];
    const wotd = getWotd(date);

    return guesses
      .map((guess) => foods.find((f) => f.name === guess))
      .filter((food): food is Food => !!food)
      .map((food) => ({
        guess: food.name,
        ingredients: getIngredientsResults(food, wotd),
        result: food.name === wotd.name ? 'jackpot' : 'wrong',
        missing: wotd.ingredients.filter(
          (ingredient) => !food.ingredients.includes(ingredient)
        ).length,
      }));
  },
  persist(date: Date, dateGuesses: GuessResult[], cookie: Cookie): void {
    const dateKey = getDateKey(date);
    cookie.set(dateKey, dateGuesses.map((g) => g.guess).join(','), {
      path: '/',
      expires: add(date, { days: 1 }),
    });
  },
};

export default StorageService;
