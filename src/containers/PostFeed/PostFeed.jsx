import React from 'react';
import BskyPost from '../BskyPost/BskyPost';

export default function PostFeed({ feed = [], cursor }) {
  return (
    <div className="post-feed">
      {feed.map(({ post }) => {
        return <BskyPost post={post} key={post.uri} />;
      })}
    </div>
  );
}
