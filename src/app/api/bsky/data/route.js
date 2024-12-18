import dbConnect from '@/database/db';
import { getSessionUser } from '../../utils';
import { BskyAgent } from '@atproto/api';
import Account from '@/database/models/accountSchema';
import { NextResponse } from 'next/server';

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

export async function GET(req) {
  const user = await getSessionUser();
  await dbConnect();
  const account = await Account.findOne({ userId: user._id, currentlyActive: true });
  const accessToken = account.accessJwt;
  await agent.resumeSession({ 
    accessJwt: accessToken, 
    did: account.did, 
    refreshJwt: account.refreshJwt
  }).then(async (res) => {
    const { accessJwt, refreshJwt } = agent.session;
    await Account.findByIdAndUpdate(account._id, { accessJwt, refreshJwt });
    return res;
  });
  const query = req.nextUrl.searchParams.get('query');
  if (query === 'myLikes') {
    const username = account.handle;
    const likes = await agent.getActorLikes({
      actor: username,
    });
    return NextResponse.json(likes);
  }
  if (query === 'myFeed') {
    const f = await agent.app.bsky.feed.getFeed({
      // algorithm: 'ranked',
      feed: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
      limit: 60
    });
    // console.log('feeds', feeds);
    const feed = await agent.getTimeline({
      // algorithm: 'ranked',
    });
    return NextResponse.json(feed);
  }
}
