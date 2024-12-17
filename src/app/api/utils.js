import dbConnect from '@/database/db';
import { headers } from 'next/headers';
import User from '@/database/models/userSchema';
import Account from '@/database/models/accountSchema';

export const getSessionUser = async () => {
  await dbConnect();
  const headersList = await headers();
  const session = headersList.get('bsky-session');
  const user = await User.findOne({ tempSessionId: session }).lean();
  const account = await Account.findOne({
    userId: user._id,
    currentlyActive: true,
  });
  return {
    ...user,
    id: user?._id,
    account,
  };
};

export const getActiveAccount = async () => {
  const user = await getSessionUser();
  const account = await Account.findOne({ userId: user._id, isActive: true });
  return account;
};
