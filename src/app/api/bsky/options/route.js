import Account from '@/database/models/accountSchema';
import { BskyAgent } from '@atproto/api';
import { getSessionUser } from '../../utils';
const agent = new BskyAgent({
  service: 'https://bsky.social',
});

export const GET = async () => {
  const user = await getSessionUser();
  const account = user.account;
  const accessToken = account.accessJwt;
  await agent.resumeSession({
    accessJwt: accessToken,
    did: account.did,
    refreshJwt: account.refreshJwt,
  });
  const feed = await agent.app.bsky.feed.getSuggestedFeeds({
    // algorithm: 'ranked',
  });
  return NextResponse.json(feed);
};
