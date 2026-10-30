import { MongoClient } from 'mongodb';

let client;
let connectionPromise;

const getDb = async () => {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined.');
  }

  if (!databaseName) {
    throw new Error('MONGODB_DB_NAME is not defined.');
  }

  if (!connectionPromise) {
    client ??= new MongoClient(uri);
    connectionPromise = (async () => {
      await client.connect();
      return client.db(databaseName);
    })();
  }

  const pendingConnection = connectionPromise;

  try {
    return await pendingConnection;
  } catch (error) {
    if (connectionPromise === pendingConnection) {
      connectionPromise = undefined;
    }

    throw error;
  }
};

export { getDb };
