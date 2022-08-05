import foods from '@data/foods';
import GuessResponse from '@data/types/GuessResponse';
import GuessResult from '@data/types/GuessResult';
import axios from 'axios';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FC, KeyboardEvent, useState } from 'react';

const Game: FC = () => {
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [guessInputValue, setGuessInputValue] = useState('');
  const [win, setWin] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof foods>([]);

  const guessFood = async (guess: string) => {
    const { data: res } = await axios.post<GuessResponse>('/api/guess', {
      guess,
    });

    if (!res.success) return;

    setSuggestions([]);

    const guessResult = res.data;
    setGuesses((prev) => [...prev, guessResult]);
    setGuessInputValue('');

    if (guessResult.result === 'jackpot') {
      setWin(true);
    }
  };

  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const updateGuess = (value: string) => {
    setGuessInputValue(value.toLowerCase());

    const suggestions = foods
      .filter(
        (food) =>
          food.name.includes(value.toLowerCase()) &&
          !guesses.find(
            (g) => g.guess.toLowerCase() === food.name.toLowerCase()
          )
      )
      .sort((a, b) => a.name.indexOf(value) - b.name.indexOf(value))
      .slice(0, 5)
      .reverse();

    setSuggestions(suggestions);
    setActiveSuggestion(Math.max(0, suggestions.length - 1));
  };

  const kbdAction = (event: KeyboardEvent<HTMLInputElement>) => {
    const keyActions = new Map<string, () => void>([
      ['Enter', () => guessFood(suggestions[activeSuggestion]?.name)],
      [
        'ArrowUp',
        () =>
          setActiveSuggestion((prev) =>
            prev ? prev - 1 : suggestions.length - 1
          ),
      ],
      [
        'ArrowDown',
        () =>
          setActiveSuggestion((prev) =>
            prev === suggestions.length - 1 ? 0 : prev + 1
          ),
      ],
    ]);

    if (keyActions.has(event.key)) {
      event.preventDefault();
      keyActions.get(event.key)?.();
    }
  };

  return (
    <>
      <ul className='grow overflow-auto flex flex-wrap items-start gap-1'>
        {guesses
          .slice()
          .reverse()
          .map((guess) => (
            <motion.li
              key={guess.guess}
              layoutId={guess.guess}
              className='block p-2 border border-slate-800'
            >
              <span className='font-semibold uppercase text-sm text-slate-400'>
                {guess.guess}
              </span>
              <ul>
                {guess.ingredients.map((ing) => (
                  <motion.li
                    key={ing.name}
                    animate={{ height: ['0', '0', '1.5em'] }}
                    className='overflow-hidden'
                  >
                    {ing.correct ? '✔️' : '❌'} {ing.name}
                  </motion.li>
                ))}
              </ul>
            </motion.li>
          ))}
      </ul>
      <ul>
        {suggestions.map((sug, i) => (
          <motion.li key={sug.name} layoutId={sug.name}>
            <button
              onClick={() => guessFood(sug.name)}
              onMouseOver={() => setActiveSuggestion(i)}
              className={clsx('w-full text-left p-1 border-b', {
                'bg-slate-500': activeSuggestion === i,
              })}
            >
              {sug.name.slice(0, sug.name.indexOf(guessInputValue))}
              <strong>
                {sug.name.slice(
                  sug.name.indexOf(guessInputValue),
                  sug.name.indexOf(guessInputValue) + guessInputValue.length
                )}
              </strong>
              {sug.name.slice(
                sug.name.indexOf(guessInputValue) + guessInputValue.length
              )}
            </button>
          </motion.li>
        ))}
      </ul>
      <input
        className='p-1 bg-slate-50 text-slate-900 text-sm text-semibold'
        placeholder='ex. pastel de frango'
        onChange={(e) => updateGuess(e.target.value)}
        onKeyDown={kbdAction}
        value={guessInputValue}
        disabled={win}
      />
      <p>Tentativas: {guesses.length}</p>
      {win && <p>Você venceu! 🎉</p>}
    </>
  );
};

export default Game;
