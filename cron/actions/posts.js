const { MongoClient } = require('mongodb');
const profiles = require('../../data/profiles.json');
const { AtpAgent } = require('@atproto/api');
const configProvider = require('../../config');
const agent = new AtpAgent({
  service: 'https://public.api.bsky.app',
});
const posts_db = configProvider.posts_db;

const fetchRecordsLimit = 120;

const getPostsForProfile = async (handle) => {
  return agent
    .getAuthorFeed({
      actor: handle,
      limit: 100,
    })
    .then((res) => {
      return res.data.feed;
    })
    .catch((error) => {
      console.log('error fetching posts for profile', handle, error);
      return [];
    });
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPosts = async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db(posts_db);
  const fetchProfiles = profiles.slice(0, fetchRecordsLimit);
  const allPosts = [];
  console.time('fetchPosts');
  let index = 0;
  for (const profile of fetchProfiles) {
    const posts = await getPostsForProfile(profile.handle);
    allPosts.push(...posts);
    await sleep(100);
    index++;
    console.log(`${index}/${fetchProfiles.length}`);
  }
  console.timeEnd('fetchPosts');
  const result = await db.collection('top_posts').insertMany(allPosts);
  const insertedIds = Object.values(result.insertedIds);
  const fetched = await db.collection('fetches').insertOne({
    date: new Date(),
    count: allPosts.length,
    insertedIds: insertedIds,
  });
  console.log('insertedIds', insertedIds);
  console.log('fetched', fetched);
};

module.exports = fetchPosts;
