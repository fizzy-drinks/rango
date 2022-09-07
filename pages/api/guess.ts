import getGuessResult from 'data/services/getGuessResult';
import StorageService from 'data/services/storage.service';
import GuessResponse from 'data/types/GuessResponse';
import GuessResult from 'data/types/GuessResult';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Cookie } from 'next-cookie';

const updateResponseCookie = (
  req: NextApiRequest,
  res: NextApiResponse,
  result: GuessResult
) => {
  const cookie = Cookie.fromApiRoute(req, res);
  const userGuesses = StorageService.getGuessesAtDate(new Date(), cookie);
  StorageService.persist(new Date(), [...userGuesses, result], cookie);
};

const POST: NextApiHandler<GuessResponse> = (req, res) => {
  const { guess } = req.body as { guess?: string };

  if (!guess) {
    return res.send({ success: false, message: 'Not a valid food' });
  }

  const result = getGuessResult(guess);
  updateResponseCookie(req, res, result);

  return res.send({
    success: true,
    data: result,
  });
};

const handler: NextApiHandler<GuessResponse> = (req, res) => {
  const methods: Record<string, NextApiHandler> = { POST };

  if (req.method && methods[req.method]) {
    return methods[req.method](req, res);
  } else {
    return res
      .status(405)
      .send({ message: 'Method not allowed', success: false });
  }
};

export default handler;
