import GuessResult from 'data/types/GuessResult';
import { FC, useState } from 'react';
import GuessInput from './GuessInput';
import GuessList from './GuessList';
import WinPanel from './WinPanel';

const Rango: FC<{ preloadGuesses: GuessResult[] }> = ({ preloadGuesses }) => {
  const [guesses, setGuesses] = useState<GuessResult[]>(preloadGuesses);
  const win = guesses.some((g) => g.result === 'jackpot');

  return (
    <>
      <GuessList guesses={guesses} />
      {win ? (
        <WinPanel guesses={guesses} />
      ) : (
        <GuessInput guesses={guesses} onChange={setGuesses} />
      )}
    </>
  );
};

export default Rango;
