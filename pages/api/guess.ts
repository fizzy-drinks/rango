import foods from '@data/foods';
import getWotd from '@data/services/getWotd';
import GuessResponse from '@data/types/GuessResponse';
import { NextApiHandler } from 'next';

const handler: NextApiHandler<GuessResponse> = (req, res) => {
  if (req.method === 'POST') {
    const { guess } = req.body as { guess?: string };

    const guessedFood = foods.find(
      (f) => f.name.toLowerCase() === guess?.toLowerCase()
    );

    if (!guess || !guessedFood) {
      return res.send({ success: false, message: 'Not a valid food' });
    }

    const wotd = getWotd();

    const ingredients = guessedFood.ingredients.map((ing) => ({
      name: ing,
      correct: wotd.ingredients.includes(ing),
    }));

    return res.send({
      success: true,
      data: {
        guess,
        result: wotd.name === guess ? 'jackpot' : 'wrong',
        ingredients,
      },
    });
  }

  res.statusCode = 405;
  res.send({ success: false, message: 'Method not allowed' });
};

export default handler;
