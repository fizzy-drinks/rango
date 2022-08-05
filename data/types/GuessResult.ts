type GuessResult = {
  guess: string;
  result: 'wrong' | 'jackpot';
  ingredients: { name: string; correct: boolean }[];
};

export default GuessResult;
