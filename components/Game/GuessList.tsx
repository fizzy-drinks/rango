import GuessResult from 'data/types/GuessResult';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { FC } from 'react';
import Twemoji from 'react-twemoji';
import correctRatio from './helpers/correctRatio';

const GuessList: FC<{ guesses: GuessResult[] }> = ({ guesses }) => {
  const liAnimation = { height: ['0', '0', '1.5em'] };

  return (
    <div className='grow overflow-auto'>
      <Twemoji>
        <ul className='flex flex-wrap items-stretch gap-1'>
          {guesses
            .slice()
            .reverse()
            .map((guess) => (
              <motion.li
                key={guess.guess}
                layoutId={guess.guess}
                className='flex flex-col p-2 border border-slate-800 w-52'
              >
                <span className='font-semibold uppercase text-sm text-slate-400'>
                  {guess.guess}
                </span>
                <ul className='grow'>
                  {guess.ingredients.map((ing) => (
                    <motion.li
                      key={ing.name}
                      animate={liAnimation}
                      className='overflow-hidden'
                    >
                      {ing.correct ? '✔️' : '❌'} {ing.name}
                    </motion.li>
                  ))}
                </ul>
                {guess.missing > 0 && (
                  <div className='text-sm text-right mt-1 text-slate-500 font-semibold'>
                    +{guess.missing}
                  </div>
                )}
                <div
                  className={clsx(
                    'block w-100 border-t-2 mt-2',
                    ((r) =>
                      r === 1
                        ? 'border-green-300'
                        : r >= 0.5
                        ? 'border-yellow-300'
                        : r > 0
                        ? 'border-orange-300'
                        : 'border-red-300')(correctRatio(guess))
                  )}
                />
              </motion.li>
            ))}
        </ul>
      </Twemoji>
    </div>
  );
};

export default GuessList;
