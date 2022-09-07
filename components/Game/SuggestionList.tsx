import clsx from 'clsx';
import { Food } from 'data/types/Food';
import { motion } from 'framer-motion';
import { FC } from 'react';

const SuggestionList: FC<{
  suggestions: Food[];
  highlight: string;
  activeSuggestion: number;
  onSuggestionHover: (suggestionIndex: number) => void;
  onSelect: (selected: string) => void;
}> = ({
  suggestions,
  highlight,
  activeSuggestion,
  onSuggestionHover,
  onSelect,
}) => {
  return (
    <ul className='w-full'>
      {suggestions.map((sug, i) => (
        <motion.li key={sug.name} layoutId={sug.name}>
          <button
            onClick={() => onSelect(sug.name)}
            onMouseOver={() => onSuggestionHover(i)}
            className={clsx('w-full text-left p-1 border-b', {
              'bg-slate-500': activeSuggestion === i,
            })}
          >
            {sug.name.slice(0, sug.name.indexOf(highlight))}
            <strong>
              {sug.name.slice(
                sug.name.indexOf(highlight),
                sug.name.indexOf(highlight) + highlight.length
              )}
            </strong>
            {sug.name.slice(sug.name.indexOf(highlight) + highlight.length)}
          </button>
        </motion.li>
      ))}
    </ul>
  );
};

export default SuggestionList;
