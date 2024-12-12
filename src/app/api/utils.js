import dbConnect from '@/database/db';
import { headers } from 'next/headers';
import User from '@/database/models/userSchema';

export const getSessionUser = async () => {
  await dbConnect();
  const headersList = await headers();
  const session = headersList.get('bsky-session');
  const user = await User.findOne({ tempSessionId: session }).lean();
  return {
    ...user,
    id: user._id,
  };
};
