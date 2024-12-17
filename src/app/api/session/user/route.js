import { NextResponse } from 'next/server';
import { getSessionUser } from '../../utils';
import Account from '@/database/models/accountSchema';

export const GET = async () => {
  const user = await getSessionUser();
  const accounts = await Account.find({ userId: user._id }).lean();
  const activeAccount = accounts.find((account) => account.currentlyActive);
  user.displayName = activeAccount.displayName;
  user.avatar = activeAccount.avatar;
  user.handle = activeAccount.handle;
  return NextResponse.json({ user, accounts });
};