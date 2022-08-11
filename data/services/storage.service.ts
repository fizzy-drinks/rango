import foods from '@data/foods';
import GuessResult from '@data/types/GuessResult';
import { format } from 'date-fns';
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
      .map((guess) => {
        const food = foods.find((f) => f.name === guess);
        if (!food) return;

        const results = getIngredientsResults(food, wotd);
        return {
          guess: food.name,
          ingredients: results,
          result: food.name === wotd.name ? 'jackpot' : 'wrong',
        };
      })
      .filter((g): g is GuessResult => !!g);
  },
  persist(date: Date, dateGuesses: GuessResult[], cookie: Cookie): void {
    const dateKey = getDateKey(date);
    cookie.set(dateKey, dateGuesses.map((g) => g.guess).join(','), {
      path: '/',
    });
  },
};

export default StorageService;
