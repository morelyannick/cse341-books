import { MongoClient } from 'mongodb';

let database;
let connectionPromise;

const getDb = async () => {
  if (database) {
    return database;
  }

  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined.');
  }

  if (!databaseName) {
    throw new Error('MONGODB_DB_NAME is not defined.');
  }

  if (!connectionPromise) {
    const client = new MongoClient(uri);
    connectionPromise = (async () => {
      await client.connect();
      return client.db(databaseName);
    })();
  }

  const pendingConnection = connectionPromise;

  try {
    database = await pendingConnection;
    return database;
  } catch (error) {
    if (connectionPromise === pendingConnection) {
      connectionPromise = undefined;
    }

    throw error;
  }
};

export { getDb };
