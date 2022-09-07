import GuessResult from 'data/types/GuessResult';
import correctRatio from './correctRatio';

const guessAsText = (guess: GuessResult) => {
  if (guess.result === 'jackpot') return '🟩';

  const r = correctRatio(guess);
  return r >= 0.5 ? '🟨' : r > 0 ? '🟧' : '🟥';
};

const shareToClipboard = (guesses: GuessResult[]): void => {
  const wotd = guesses.find((g) => g.result === 'jackpot');
  if (!wotd) throw new Error('Cannot share before winning!');

  navigator.clipboard.writeText(
    `achei o rango de hoje em ${guesses.length} tentativas

${guesses.map(guessAsText).join('')}

sua vez: ${location.href}`
  );
};

export default shareToClipboard;
