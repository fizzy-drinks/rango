import GuessResult from '@data/types/GuessResult';
import { format } from 'date-fns';
import { Cookie } from 'next-cookie';

const GUESSES_KEY = 'guesses';

const getDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

const getStoredGuesses = (
  cookie: Cookie
): { [date: string]: GuessResult[] } => {
  return cookie.get(GUESSES_KEY) || {};
};

const StorageService = {
  getGuessesAtDate(date: Date, cookie: Cookie): GuessResult[] {
    return getStoredGuesses(cookie)[getDateKey(date)] || [];
  },
  persist(date: Date, dateGuesses: GuessResult[], cookie: Cookie): void {
    const guessesObject = getStoredGuesses(cookie);
    guessesObject[getDateKey(date)] = dateGuesses;

    cookie.set(GUESSES_KEY, JSON.stringify(guessesObject), {
      path: '/',
    });
  },
};

export default StorageService;
