import dbConnect from '@/database/db';
import User from '@/database/models/userSchema';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  await dbConnect();
  // Get a default user session
  const sessionId = uuidv4();
  await User.create({
    lastTempSessionDate: new Date(),
    tempSessionId: sessionId,
  });
  return NextResponse.json({ session: sessionId });
}
