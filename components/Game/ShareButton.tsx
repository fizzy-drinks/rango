import { FC, useState } from 'react';
import Button from 'components/styled/Button';
import GuessResult from 'data/types/GuessResult';
import shareToClipboard from './helpers/shareToClipboard';

const ShareButton: FC<{ guesses: GuessResult[] }> = ({ guesses }) => {
  const [shareTimeout, setShareTimeout] = useState(false);

  const share = async () => {
    shareToClipboard(guesses);
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
