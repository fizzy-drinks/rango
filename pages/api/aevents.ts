import foods from 'data/foods';
import getDbClient from 'data/services/getDbClient';
import ipgeo from 'data/services/ipgeo';
import ApiResponse from 'data/types/ApiResponse';
import GuessResult from 'data/types/GuessResult';
import { NextApiHandler } from 'next';

type EventType = 'impression' | 'game-interaction';

type AnalyticsEventMetadata<T = unknown> = {
  custom: T;
  geo: {
    country: string;
    province: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
};

type SyntheticAnalyticsEvent<
  T extends EventType,
  M extends Record<string, unknown>
> = {
  id: number;
  session_id: string;
  event_type: T;
  metadata: AnalyticsEventMetadata<M>;
  date: Date;
};

type AnalyticsEvent =
  | SyntheticAnalyticsEvent<'impression', Record<string, never>>
  | SyntheticAnalyticsEvent<
      'game-interaction',
      {
        interactionType: 'guess';
        value: { guess: typeof foods[number]; result: GuessResult };
      }
    >;

export type AEventsPayload<T extends AnalyticsEvent = AnalyticsEvent> = {
  session_id: string;
  event_type: T['event_type'];
  metadata: T['metadata']['custom'];
};

type AEventInsertArgs<T extends AnalyticsEvent = AnalyticsEvent> = [
  string,
  T['event_type'],
  AnalyticsEventMetadata<T['metadata']['custom']>,
  Date
];

const handler: NextApiHandler<
  ApiResponse<{ aevents: AnalyticsEvent[] }>
> = async <T extends AnalyticsEvent>(req, res) => {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .send({ success: false, message: 'Method not allowed' });
  }

  const {
    session_id,
    event_type,
    metadata: customMetadata,
  }: Partial<AEventsPayload<T>> = req.body;

  if (!session_id || !event_type || !customMetadata) {
    return res.status(400).send({
      success: false,
      message: 'Missing rqeuired request arguments!',
    });
  }

  const db = await getDbClient();

  const {
    country_code2: country,
    state_prov: province,
    city,
    latitude,
    longitude,
  } = await ipgeo('179.215.126.112');

  const metadata: AnalyticsEventMetadata<T['metadata']['custom']> = {
    custom: customMetadata,
    geo: {
      country,
      province,
      city,
      coordinates: { lat: Number(latitude), lng: Number(longitude) },
    },
  };

  const { rows: aevents } = await db.query<T, AEventInsertArgs<T>>(
    `insert into aevents (session_id, event_type, metadata, date)
    values ($1, $2, $3, $4)
    returning *`,
    [session_id, event_type, metadata, new Date()]
  );

  res.send({ success: true, data: { aevents } });
};

export default handler;
