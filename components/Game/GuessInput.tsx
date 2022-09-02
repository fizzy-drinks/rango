import foods from 'data/foods';
import GuessResponse from 'data/types/GuessResponse';
import GuessResult from 'data/types/GuessResult';
import axios from 'axios';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FC, KeyboardEvent, useState } from 'react';

const GuessInput: FC<{
  guesses: GuessResult[];
  onChange: (guesses: GuessResult[]) => void;
}> = ({ guesses, onChange }) => {
  const [guessInputValue, setGuessInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<typeof foods>([]);

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

  const guessFood = async (guess: string) => {
    const { data: res } = await axios.post<GuessResponse>('/api/guess', {
      guess,
    });

    if (!res.success) return;

    setSuggestions([]);

    const guessResult = res.data;
    onChange([...guesses, guessResult]);
    setGuessInputValue('');
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
      <ul className='w-full'>
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
      />
      <p>Tentativas: {guesses.length}</p>
    </>
  );
};

export default GuessInput;
