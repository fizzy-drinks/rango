import getConfig from 'next/config';
import { Client } from 'pg';

const getDbClient = async (): Promise<Client> => {
  const { serverRuntimeConfig } = getConfig();
  const client = new Client({
    connectionString: serverRuntimeConfig.pgUrl,
  });

  await client.connect();

  return client;
};

export default getDbClient;
