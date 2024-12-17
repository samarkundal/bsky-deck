import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const connectDb = async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  return client.db('x-data');
};

export async function GET(request) {
  console.time('fetching users');
  const db = await connectDb();
  const collection = db.collection('users');
  const xUsers = await collection
    .find({
      followers_count: {
        $gt: 1000,
      },
      interactions: {
        $gt: 1,
      },
    })
    .sort({ followers_count: -1 })
    .limit(100)
    .toArray();
  console.timeEnd('fetching users');
  return NextResponse.json(xUsers);
}
