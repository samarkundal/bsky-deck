import React from 'react';
import BskyPost from '@/containers/BskyPost/BskyPost';
import { useQuery } from '@tanstack/react-query';
import PostContainer from './PostContainer';
import moment from 'moment';
import { MongoClient } from 'mongodb';
import configProvider from '../../../../../config';
import UserSession from './UserSession/UserSession';

const getPostsForFirst100Profiles = async () => {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db(configProvider.posts_db);
  const lastFetch = await db.collection('fetches').find({}).sort({ date: -1 }).limit(1).toArray();
  if(lastFetch.length === 0) {
    return [];
  }
  const posts = await db.collection('top_posts').find({
    _id: {
      $in: lastFetch[0].insertedIds,
    },
  }).sort({ 'post.indexedAt': -1 }).toArray();
  return JSON.parse(JSON.stringify(posts));
};

export default async function page() {
  const sortedPosts = await getPostsForFirst100Profiles();

  const filterPost = (post) => {
    return !post.reply && moment(post.post.record.createdAt).isAfter(moment().subtract(12, 'hours'));
  }

  const filteredPosts = sortedPosts.filter(filterPost);

  return (
    <div className='posts-page'>
      <div className='posts-container'>
        <div className="page-header-top">
          <h3 className='page-head'>Total Posts: {filteredPosts.length}</h3>
          <UserSession />
        </div>
        {filteredPosts.filter(filterPost).map((post, index) => (
          <PostContainer post={post} key={`${index}-${post.post.uri}`}   />
        ))}
        {/* {sortedPosts.map((post) => (
          <div className="post-wrapper">
            <div className='post'>
              <BskyPost post={post} />
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
