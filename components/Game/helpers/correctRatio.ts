import GuessResult from '@data/types/GuessResult';

const correctRatio = (guess: GuessResult): number => {
  const correct = guess.ingredients.filter((ing) => ing.correct).length;
  return correct / (correct + guess.missing);
};

export default correctRatio;
