import dbConnect from '@/database/db';
import User from '@/database/models/userSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  User.create({ name: 'John Doe', email: 'john@example.com' }).catch(
    (err) => {
      return NextResponse.json(
        { message: 'Error creating user', error: err },
        { status: 500 }
      );
    }
  );
  const users = await User.find({});
  return NextResponse.json({ message: 'Hello World', users });
}
