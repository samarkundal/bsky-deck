import dbConnect from '@/database/db';
import User from '@/database/models/userSchema';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSessionUser } from '../utils';
import { BskyAgent } from '@atproto/api';
import Account from '@/database/models/accountSchema';

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

const loginBskyAccount = async (username, password) => {
  const agent = new BskyAgent({
    service: 'https://bsky.social',
  });
  return agent
    .login({
      identifier: username,
      password,
    })
    .then(async (res) => {
      const profile = await agent.getProfile({
        actor: res.data.did,
      });
      const profileData = profile.data;
      return { ...res.data, ...profileData };
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export async function POST(req) {
  const user = await getSessionUser();
  // user - add email or password
  const { username, password } = await req.json();
  console.log(username, password);
  // first check if account is valid
  try {
    const response = await loginBskyAccount(username, password);
    await Account.findOneAndUpdate(
      { userId: user._id, currentlyActive: true },
      { currentlyActive: false }
    );
    const {
      did,
      handle,
      email,
      emailConfirmed,
      accessJwt,
      refreshJwt,
      displayName,
      avatar,
      description,
      followersCount,
      followsCount,
      postsCount,
    } = response;
    console.log('response', response);
    // check if already account added
    const account = await Account.create({
      username,
      password,
      userId: user._id,
      did,
      handle,
      email,
      emailConfirmed,
      accessJwt,
      refreshJwt,
      currentlyActive: true,
      displayName,
      avatar,
      description,
      followersCount,
      followsCount,
      postsCount,
    });
    console.log('account', account);
    if (!user.isConnected) {
      const updatedUser = await User.findByIdAndUpdate(user._id, {
        email: username,
        password,
        providerAccountId: did,
        isConnected: true,
      });
    }
    return NextResponse.json({ message: 'Account added' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Account not added' }, { status: 400 });
  }
}
