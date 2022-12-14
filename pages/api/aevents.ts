import getDbClient from 'data/services/getDbClient';
import ApiResponse from 'data/types/ApiResponse';
import GuessResult from 'data/types/GuessResult';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type EventType = 'impression' | 'game-interaction';

type SyntheticAnalyticsEvent<
  T extends EventType,
  M extends Record<string, unknown>
> = {
  id: number;
  session_id: string;
  event_type: T;
  metadata: M;
  date: Date;
};

type AnalyticsEvent<T extends EventType = EventType> = T extends 'impression'
  ? SyntheticAnalyticsEvent<'impression', Record<string, never>>
  : T extends 'game-interaction'
  ? SyntheticAnalyticsEvent<
      'game-interaction',
      {
        interactionType: 'guess';
        value: GuessResult;
      }
    >
  : never;

export type AEventsPayload<T extends EventType = EventType> = {
  session_id: string;
  event_type: T;
  metadata: AnalyticsEvent<T>['metadata'];
};

type AEventInsertArgs<
  E extends EventType,
  T extends AnalyticsEvent = AnalyticsEvent<E>
> = [string, E, T['metadata'], Date];

const handler: NextApiHandler<
  ApiResponse<{ aevents: AnalyticsEvent[] }>
> = async <E extends EventType, T extends AnalyticsEvent<E>>(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ aevents: AnalyticsEvent[] }>>
) => {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .send({ success: false, message: 'Method not allowed' });
  }

  const { session_id, event_type, metadata }: Partial<AEventsPayload<E>> =
    req.body;

  if (!session_id || !event_type || !metadata) {
    return res.status(400).send({
      success: false,
      message: 'Missing rqeuired request arguments!',
    });
  }

  const db = await getDbClient();

  const { rows: aevents } = await db.query<T, AEventInsertArgs<E>>(
    `insert into aevents (session_id, event_type, metadata, date)
    values ($1, $2, $3, $4)
    returning *`,
    [session_id, event_type, metadata, new Date()]
  );

  res.send({ success: true, data: { aevents } });
};

export default handler;
