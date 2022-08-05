import getWotd from '@data/services/getWotd';
import ApiResponse from '@data/types/ApiResponse';
import { NextApiHandler } from 'next';

const handler: NextApiHandler<ApiResponse<string>> = (req, res) => {
  if (req.method === 'GET') {
    return res.send({ success: true, data: getWotd().name });
  }

  res.statusCode = 405;
  res.send({ success: false, message: 'Method not allowed' });
};

export default handler;
