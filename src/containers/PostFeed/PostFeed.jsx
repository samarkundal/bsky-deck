import React from 'react';
import BskyPost from '../BskyPost/BskyPost';

export default function PostFeed({ columnId, feed = [], cursor }) {
  return (
    <div className="post-feed">
      {feed.map(({ post }, index) => {
        return <BskyPost post={post} key={`${columnId}-${index}-${post.uri}`} />;
      })}
    </div>
  );
}
