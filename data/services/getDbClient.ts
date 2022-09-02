import { Client } from 'pg';

const getDbClient = async (): Promise<Client> => {
  const client = new Client({
    connectionString: process.env.PG_URL,
  });

  await client.connect();

  return client;
};

export default getDbClient;
