import getWotd from '@data/services/getWotd';
import ApiResponse from '@data/types/ApiResponse';
import { add, eachDayOfInterval, sub } from 'date-fns';
import { NextApiHandler } from 'next';

const handler: NextApiHandler<ApiResponse<{ date: Date; wotd: string }[]>> = (
  req,
  res
) => {
  if (req.method === 'GET') {
    return res.send({
      success: true,
      data: eachDayOfInterval({
        start: sub(new Date(), { days: 30 }),
        end: add(new Date(), { days: 30 }),
      }).map((date) => ({ date, wotd: getWotd(date).name })),
    });
  }

  res.statusCode = 405;
  res.send({ success: false, message: 'Method not allowed' });
};

export default handler;
