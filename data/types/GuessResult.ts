type GuessResult = {
  guess: string;
  result: 'wrong' | 'jackpot';
  ingredients: { name: string; correct: boolean }[];
  missing: number;
};

export default GuessResult;
