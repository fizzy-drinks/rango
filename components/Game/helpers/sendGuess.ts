import axios from 'axios';
import GuessResponse from 'data/types/GuessResponse';
import GuessResult from 'data/types/GuessResult';
import trackEvent from 'helpers/trackEvent';

const sendGuess = async (guess: string): Promise<GuessResult> => {
  const { data: res } = await axios.post<GuessResponse>('/api/guess', {
    guess,
  });

  if (!res.success) throw new Error(`Guess failed! Reason: ${res.message}`);

  trackEvent({
    event_type: 'game-interaction',
    metadata: {
      interactionType: 'guess',
      value: res.data,
    },
  });

  return res.data;
};

export default sendGuess;
