import foods from '@data/foods';
import GuessResponse from '@data/types/GuessResponse';
import GuessResult from '@data/types/GuessResult';
import axios from 'axios';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  KeyboardEvent,
  useState,
} from 'react';
import { FaDiscord, FaGithubAlt } from 'react-icons/fa';
import Twemoji from 'react-twemoji';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className='px-2 mr-2 text-sm inline-block h-8 rounded border bg-slate-600 hover:bg-slate-800 transition-all disabled:hover:bg-slate-600'
  />
);

const InlineLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  <span
    {...props}
    className='cursor-pointer drop-shadow-sm text-slate-100 hover:text-slate-300'
  />
);

const Game: FC<{ preloadGuesses: GuessResult[] }> = ({ preloadGuesses }) => {
  const [guesses, setGuesses] = useState<GuessResult[]>(preloadGuesses);
  const [guessInputValue, setGuessInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<typeof foods>([]);
  const [winPanel, setWinPanel] = useState(true);
  const toggleWinPanel = () => setWinPanel((p) => !p);

  const win = guesses.some((g) => g.result === 'jackpot');

  const guessFood = async (guess: string) => {
    const { data: res } = await axios.post<GuessResponse>('/api/guess', {
      guess,
    });

    if (!res.success) return;

    setSuggestions([]);

    const guessResult = res.data;
    setGuesses((prev) => [...prev, guessResult]);
    setGuessInputValue('');
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

  const correctRatio = (guess: GuessResult) => {
    const correct = guess.ingredients.filter((ing) => ing.correct).length;
    return correct / (correct + guess.missing);
  };

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

  const liAnimation = { height: ['0', '0', '1.5em'] };

  return (
    <Twemoji>
      <div className='grow overflow-auto'>
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
      </div>
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
      {!win && (
        <>
          <input
            className='p-1 bg-slate-50 text-slate-900 text-sm text-semibold'
            placeholder='ex. pastel de frango'
            onChange={(e) => updateGuess(e.target.value)}
            onKeyDown={kbdAction}
            value={guessInputValue}
            disabled={win}
          />
          <p>Tentativas: {guesses.length}</p>
        </>
      )}
      {win && (
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
          </motion.section>
          <motion.div
            layoutId='links'
            className='absolute bottom-0 right-0 m-3'
          >
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
      )}
    </Twemoji>
  );
};

export default Game;
