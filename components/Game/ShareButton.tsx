import { FC, useState } from 'react';
import Button from 'components/styled/Button';
import GuessResult from 'data/types/GuessResult';
import correctRatio from './helpers/correctRatio';

const ShareButton: FC<{ guesses: GuessResult[] }> = ({ guesses }) => {
  const [shareTimeout, setShareTimeout] = useState(false);

  const share = async () => {
    const wotd = guesses.find((g) => g.result === 'jackpot');
    if (!wotd) throw new Error('Cannot share before winning!');

    const guessAsText = (guess: GuessResult) => {
      if (guess.result === 'jackpot') return '🟩';

      const r = correctRatio(guess);
      return r >= 0.5 ? '🟨' : r > 0 ? '🟧' : '🟥';
    };

    navigator.clipboard.writeText(
      `achei o rango de hoje em ${guesses.length} tentativas

${guesses.map(guessAsText).join('')}

sua vez: ${location.href}`
    );

    setShareTimeout(true);
    setTimeout(() => {
      setShareTimeout(false);
    }, 1000);
  };

  return (
    <Button className='text-sm' onClick={share} disabled={shareTimeout}>
      {shareTimeout ? '📄 Copiado' : '🔗 Compartilhar'}
    </Button>
  );
};

export default ShareButton;
