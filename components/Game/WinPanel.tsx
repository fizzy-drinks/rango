import Button from 'components/styled/Button';
import InlineLink from 'components/styled/InlineLink';
import GuessResult from 'data/types/GuessResult';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FC, useState } from 'react';
import { FaDiscord, FaGithubAlt } from 'react-icons/fa';
import Twemoji from 'react-twemoji';
import correctRatio from './helpers/correctRatio';

const WinPanel: FC<{ guesses: GuessResult[] }> = ({ guesses }) => {
  const [winPanel, setWinPanel] = useState(true);
  const toggleWinPanel = () => setWinPanel((p) => !p);

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
    <motion.div
      layout
      className={clsx(
        'absolute bottom-0 left-0 w-full flex items-center justify-center',
        winPanel ? 'h-full' : 'h-36'
      )}
    >
      <div
        className={clsx(
          'absolute top-0 left-0 w-full h-full transition-all',
          winPanel ? 'bg-slate-600/40' : 'bg-slate-600'
        )}
      />
      <motion.section
        layoutId='win-panel'
        className='relative bg-slate-600 rounded-md p-7 w-96'
      >
        <Twemoji>
          <div className='flex justify-between items-start gap-2'>
            <h2 className='text-3xl font-bold mb-3'>Você venceu! 🎉</h2>
            <button
              className='text-slate-400 hover:text-white'
              onClick={toggleWinPanel}
            >
              {winPanel ? <>&ndash;</> : <>+</>}
            </button>
          </div>
          <p className='mb-3'>Em {guesses.length} tentativas</p>
          <AnimatePresence>
            {winPanel && (
              <motion.aside
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '1.5rem', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='mt-3 text-sm'
              >
                <Button
                  className='text-sm'
                  onClick={share}
                  disabled={shareTimeout}
                >
                  {shareTimeout ? '📄 Copiado' : '🔗 Compartilhar'}
                </Button>
              </motion.aside>
            )}
          </AnimatePresence>
        </Twemoji>
      </motion.section>
      <motion.div layoutId='links' className='absolute bottom-0 right-0 m-3'>
        <a
          href='https://discord.gg/bJ7S3BbTAB'
          target='_blank'
          rel='noreferrer'
        >
          <InlineLink>
            <FaDiscord /> Discord
          </InlineLink>
        </a>{' '}
        |{' '}
        <a
          href='https://github.com/fizzy-drinks/rango'
          target='_blank'
          rel='noreferrer'
        >
          <InlineLink>
            <FaGithubAlt /> Fonte
          </InlineLink>
        </a>
      </motion.div>
    </motion.div>
  );
};

export default WinPanel;
