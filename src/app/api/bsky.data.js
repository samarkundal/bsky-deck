import { AtpAgent } from '@atproto/api';
import axios from 'axios';
import moment from 'moment';

const bskyDataService = {};
const agent = new AtpAgent({
  service: 'https://bsky.social',
});
const publicAgent = new AtpAgent({
  service: 'https://public.api.bsky.app',
});

const getSingleAuthorFeed = async ({ actor }) => {
  return publicAgent.app.bsky.feed.getAuthorFeed({
    actor,
    filter: 'posts_no_replies',
  }).then((res) => {
    return res.data;
  });
};

bskyDataService.getTrendingNews = async () => {
  const response = await axios.get('https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed', {
    params: {
      feed: 'at://did:plc:kkf4naxqmweop7dv4l2iqqf5/app.bsky.feed.generator/news-2-0',
      limit: 50,
    },
  });
  return response.data;
};

bskyDataService.searchPosts = async ({ query }) => {
  const response = await axios.get('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts', {
    params: {
      q: query,
      sort: 'top',
      limit: 50,
    },
  });
  return {
    feed: response.data.posts.map((post) => ({ post })),
    cursor: response.data.cursor,
  };
};

bskyDataService.getProfilePosts = async ({ actors = [] }) => {
  const promises = [];
  actors.forEach((actor) => {
    promises.push(getSingleAuthorFeed({ actor }));
  });
  const responses = await Promise.all(promises);
  const feed = [];
  responses.forEach((response) => {
    feed.push(...response.feed);
  });
  const sortedFeed = feed.sort((a, b) => moment(b.post.indexedAt).isBefore(moment(a.post.indexedAt)) ? -1 : 1);
  return {
    feed: sortedFeed,
    cursor: null,
  };
};

bskyDataService.getUserFeed = async ({ feed, account }) => {
  console.log('account', account);
  await agent.resumeSession({ accessJwt: account.accessJwt, did: account.did, refreshJwt: account.refreshJwt });
  return agent.app.bsky.feed.getFeed({
    feed,
    limit: 50,
  }).then((res) => {
    return res.data;
  });
};

export default bskyDataService;