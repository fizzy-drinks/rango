import GuessResult from 'data/types/GuessResult';
import { FC, KeyboardEvent, useState } from 'react';
import { Food } from 'data/types/Food';
import getSuggestions from './helpers/getSuggestions';
import SuggestionList from './SuggestionList';
import sendGuess from './helpers/sendGuess';

const GuessInput: FC<{
  guesses: GuessResult[];
  onChange: (guesses: GuessResult[]) => void;
}> = ({ guesses, onChange }) => {
  const [guessInputValue, setGuessInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Food[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const updateGuess = (value: string) => {
    setGuessInputValue(value.toLowerCase());
    setSuggestions(getSuggestions(guesses, value));
    setActiveSuggestion(Math.max(0, suggestions.length - 1));
  };

  const guessFood = async (guess: string) => {
    setSuggestions([]);
    const guessResult = await sendGuess(guess);
    onChange([...guesses, guessResult]);
    setGuessInputValue('');
    setActiveSuggestion(0);
  };

  const kbdAction = (event: KeyboardEvent<HTMLInputElement>) => {
    const keyActions: Record<string, () => void> = {
      Enter: () => guessFood(suggestions[activeSuggestion]?.name),
      ArrowUp: () =>
        setActiveSuggestion((prev) =>
          prev ? prev - 1 : suggestions.length - 1
        ),
      ArrowDown: () =>
        setActiveSuggestion((prev) =>
          prev === suggestions.length - 1 ? 0 : prev + 1
        ),
    };

    if (keyActions[event.key]) {
      event.preventDefault();
      keyActions[event.key]();
    }
  };

  return (
    <>
      <SuggestionList
        suggestions={suggestions}
        highlight={guessInputValue}
        activeSuggestion={activeSuggestion}
        onSuggestionHover={setActiveSuggestion}
        onSelect={guessFood}
      />
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
