import Waitlist from '@/database/models/waitlistSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, email } = await req.json();
  const waitlist = new Waitlist({ name, email });
  await waitlist.save();
  return NextResponse.json({ message: 'Waitlist submitted successfully' });
}
