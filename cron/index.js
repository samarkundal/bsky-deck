const cron = require('node-cron');

const fetchPosts = require('./actions/posts');

const cronHandlerFetchPosts = async () => {
  try {
    console.log('Running fetch posts cron job');
    await fetchPosts();
  } catch (error) {
    console.log('cron failed for fetch interval posts', error);
  }
};

const setup = () => {
  console.log('setting up cron job');
  cronHandlerFetchPosts();
  cron.schedule('0 */1 * * *', cronHandlerFetchPosts);
};

setup();
