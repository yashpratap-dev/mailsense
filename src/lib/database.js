import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export async function connectToDatabase() {
  if (!uri) {
    throw new Error('Please add your MONGODB_URI to environment variables');
  }
  if (!client) {
    client = await clientPromise;
  }
  return client.db('mySaaSApp');
}
