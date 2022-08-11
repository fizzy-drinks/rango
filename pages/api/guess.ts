import foods from '@data/foods';
import getIngredientsResults from '@data/services/getIngredientsResults';
import getWotd from '@data/services/getWotd';
import StorageService from '@data/services/storage.service';
import GuessResponse from '@data/types/GuessResponse';
import GuessResult from '@data/types/GuessResult';
import { NextApiHandler } from 'next';
import { Cookie } from 'next-cookie';

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

    const ingredients = getIngredientsResults(guessedFood, wotd);

    const cookie = Cookie.fromApiRoute(req, res);
    const userGuesses = StorageService.getGuessesAtDate(new Date(), cookie);
    const result: GuessResult = {
      guess,
      result: wotd.name === guess ? 'jackpot' : 'wrong',
      ingredients,
    };

    StorageService.persist(new Date(), [...userGuesses, result], cookie);

    return res.send({
      success: true,
      data: result,
    });
  }

  res.statusCode = 405;
  res.send({ success: false, message: 'Method not allowed' });
};

export default handler;
