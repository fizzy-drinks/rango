import GuessResult from 'data/types/GuessResult';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FC, useState } from 'react';
import { FaDiscord, FaGithubAlt } from 'react-icons/fa';
import Twemoji from 'react-twemoji';
import FooterLink from 'components/styled/FooterLink';
import ShareButton from './ShareButton';

const WinPanel: FC<{ guesses: GuessResult[] }> = ({ guesses }) => {
  const [winPanel, setWinPanel] = useState(true);
  const toggleWinPanel = () => setWinPanel((p) => !p);

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
                <ShareButton guesses={guesses} />
              </motion.aside>
            )}
          </AnimatePresence>
        </Twemoji>
      </motion.section>
      <motion.div layoutId='links' className='absolute bottom-0 right-0 m-3'>
        <FooterLink href='https://discord.gg/bJ7S3BbTAB'>
          <FaDiscord /> Discord
        </FooterLink>{' '}
        |{' '}
        <FooterLink href='https://github.com/fizzy-drinks/rango'>
          <FaGithubAlt /> Fonte
        </FooterLink>
      </motion.div>
    </motion.div>
  );
};

export default WinPanel;
