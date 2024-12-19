'use client';
import React, { useState } from 'react';
import './PostContainer.scss';
import moment from 'moment';
import { TbHeart, TbMessage, TbSparkles } from 'react-icons/tb';
import getSuggestions from './getSuggestions';
import { AtpAgent } from '@atproto/api';


const agent = new AtpAgent({
  service: 'https://bsky.social',
});

const PostEmbed = ({ embed }) => {
  const image =
    embed.images && embed.images.length > 0 ? embed.images[0] : null;

  if (embed.$type === 'app.bsky.embed.video#view') {
    return (
      <div className="post-embed">
        <img src={embed.thumbnail} playsInline controls />
      </div>
    );
  }

  if (embed.$type === 'app.bsky.embed.images#view') {
    return (
      <div className="post-embed">
        {image && <img src={image.thumb} alt={image.alt} />}
      </div>
    );
  }

  return null;
};

export default function PostContainer({ post: postData }) {
  const { post, reply } = postData;
  const [replyText, setReplyText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const getPostId = (post) => {
    return post.uri.split('/').pop();
  };

  const handleClick = () => {
    console.log('clicked', post);
  };

  const handleWriteWithAI = async () => {
    const suggestions = await getSuggestions(post.record.text);
    const reply = suggestions[1];
    setReplyText(reply);
  };

  const handleReplyPost = async () => {
    if(!replyText || replyText.length < 3) {
      alert('Please write a reply');
      return;
    }
    if(replyText && replyText.length > 3) {
      await agent.resumeSession({
        accessJwt: localStorage.getItem('bsky_accessJwt'),
        did: localStorage.getItem('bsky_did'),
        refreshJwt: localStorage.getItem('bsky_refreshJwt'),
      });
      const postId = post.uri;
      const postCid = post.cid;
      await agent.like(postId, postCid);
      setTimeout(() => {
        agent.post({
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
          text: replyText,
        }).then((res) => {
          setIsSuccess(true);
        });
      }, 1000);
    }
  };

  return (
    <div className="post-container" onClick={handleClick}>
      <div className="post-info">
        <div className="post-author">
          <div className="author-avatar">
            <img src={post.author.avatar} alt={post.author.displayName} />
          </div>
          <div className="author-meta">
            <h4>{post.author.displayName}</h4>
            <p>{post.author.handle}</p>
          </div>
          <div className="view-post">
            <a
              href={`https://bsky.app/profile/${
                post.author.handle
              }/post/${getPostId(post)}`}
              target="_blank"
            >
              View Post
            </a>
          </div>
          <div className="created-post">
            {moment(post.record.createdAt).format('DD MMM, HH:mm A')} (
            {moment(post.record.createdAt).fromNow()})
          </div>
        </div>
        <div className="post-text">
          <p>{post.record.text}</p>
        </div>
        <div className="post-stats">
          <div className="stat">
            <TbHeart />
            <p>{post.likeCount}</p>
          </div>
          <div className="stat">
            <TbMessage />
            <p>{post.replyCount}</p>
          </div>
        </div>
        {post.embed && (
          <div className="post-embeds">
            <PostEmbed embed={post.embed} />
          </div>
        )}
      </div>
      <div className="post-action">
        <div className="post-reply">
          <textarea
            placeholder="Reply to post"
            rows={8}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="actions">
            <button onClick={handleReplyPost}>Reply</button>
            <button className="write-with-ai" onClick={handleWriteWithAI}>
              <TbSparkles size={18} />
              <span>Write with AI</span>
            </button>
          </div>
          {isSuccess && (
            <div className="success-message" style={{ color: 'green' }}>
              <p>Reply posted successfully</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
