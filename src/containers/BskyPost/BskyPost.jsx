import React from 'react';
import './BskyPost.scss';
import { TbHeart, TbMessage, TbRepeat } from 'react-icons/tb';

const generateEmbedImageLink = (did, embed) => {
  return `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${embed.image}@jpeg`;
};

const extractPostId = (post) => {
  try {
    return post.uri.split('/').pop();
  } catch (error) {
    return post.uri;
  }
};

export default function BskyPost({ post }) {
  const hasEmbedding = !!post.record.embed;

  const handleOpenNewTab = () => {
    console.log(post);
    window.open(`https://bsky.app/profile/${post.author.handle}/post/${extractPostId(post)}`, '_blank');
  };

  return (
    <div className="bsky-post-container" onClick={handleOpenNewTab}>
      <div className="bsky-post">
        <div className="bsky-avatar">
          <img src={post.author.avatar} alt={post.author.displayName} />
        </div>
        <div className="bsky-post-info">
          <div className="post-username">
            <span className="username">{post.author.displayName}</span>
            <span className="username-handle">@{post.author.handle}</span>
          </div>
          <div className="post-text">{post.record.text}</div>
        </div>
      </div>
      {hasEmbedding && (
        <div className="post-embedding">
          {post.record.embed['$type'] === 'app.bsky.embed.external' && (
            <div className="external-link-embed">
              <div className="embed-img-container">
                <img
                  src={post.embed.external?.thumb}
                  alt={post.embed.external?.title}
                />
              </div>
              <div className="embed-info">
                <div className="embed-title">
                  {post.embed.external?.title}
                </div>
                <div className="embed-description">
                  {post.embed.external?.description}
                </div>
                {/* <div className="embed-link">
                  {post.record.embed.external?.uri}
                </div> */}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="bsky-post-actions">
        <div className="post-action">
          <button>
            <TbMessage size={20} strokeWidth={1.5} />
            <span>{post.replyCount}</span>
          </button>
        </div>
        <div className="post-action">
          <button>
            <TbRepeat size={20} strokeWidth={1.5} />
            <span>{post.repostCount}</span>
          </button>
        </div>
        <div className="post-action">
          <button>
            <TbHeart size={20} strokeWidth={1.5} />
            <span>{post.likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
