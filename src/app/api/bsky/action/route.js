import Account from '@/database/models/accountSchema';
import { BskyAgent } from '@atproto/api';
import { NextResponse } from 'next/server';
import { getSessionUser } from '../../utils';
const username = 'brownmarcus.bsky.social';
const password = 'bsky@CLOUD0';

const agent = new BskyAgent({
  service: 'https://bsky.social'
});

export async function POST(req) {
  const user = await getSessionUser();
  const { actionType, postId, text, postCid } = await req.json();
  const account = await Account.findOne({ userId: user._id, currentlyActive: true });
  const accessToken = account.accessJwt;
  const token = accessToken;
  console.log('accessToken::', token);
  console.log('agent.sessionManager.did::', agent.session?.handle);
  await agent.resumeSession({ accessJwt: token, did: account.did });
  console.log('agent.sessionManager.did::', agent.session?.handle);
  switch (actionType) {
    case 'like':
      const res = await agent.like(postId, postCid).catch((e) => {
        console.log('error::', e);
      });
      console.log('res::', res);
      break;
    case 'reply':
      console.log('text:::', text);
      await agent.post({
        reply: {
          parent: {
            uri: postId,
            cid: postCid,
          },
          root: {
            uri: postId,
            cid: postCid,
          },
        },
        text,
      });
      break;
    case 'repost':
      await agent.repost(postId, postCid);
      break;
  }
  return NextResponse.json({ success: true });
}
