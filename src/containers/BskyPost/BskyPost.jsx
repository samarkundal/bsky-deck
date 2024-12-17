import React, { useEffect, useState } from 'react';
import './BskyPost.scss';
import { TbHeart, TbMessage, TbRepeat } from 'react-icons/tb';
import { performAction } from '@/services/api.service';
import classNames from 'classnames';
import moment from 'moment';
import Modal from '@/components/ui/Modal/Modal';

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
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const handleOpenNewTab = () => {
    console.log(post);
    window.open(
      `https://bsky.app/profile/${post.author.handle}/post/${extractPostId(
        post
      )}`,
      '_blank'
    );
  };

  const likePost = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsLiked(!isLiked);
    post.likeCount = !isLiked ? post.likeCount + 1 : post.likeCount - 1;
    await performAction({
      actionType: 'like',
      postId: post.uri,
      postCid: post.cid,
    });
  };

  useEffect(() => {
    if (post && post?.viewer && post?.viewer?.like) {
      setIsLiked(true);
    }
  }, [post]);

  const formatDate = (date) => {
    const mins = moment().diff(date, 'minutes');
    if (mins < 60) {
      return `${mins}m`;
    }
    const hours = moment().diff(date, 'hours');
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = moment().diff(date, 'days');
    if (days < 30) {
      return `${days}d`;
    }
    return moment(date).fromNow();
  };

  const handleOpenReplyModal = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setReplyModalOpen(false);
  };

  const handleRepost = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsReposted(!isReposted);
    post.repostCount = !isReposted ? post.repostCount + 1 : post.repostCount - 1;
    await performAction({
      actionType: 'repost',
      postId: post.uri,
      postCid: post.cid,
    });
  };

  const handleReply = async (event) => {
    event.preventDefault();
    const replyText = event.target.replyText.value;
    await performAction({
      actionType: 'reply',
      postId: post.uri,
      postCid: post.cid,
      text: replyText,
    }).then(() => {
      handleCloseReplyModal();
    });
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
        <div className="bsky-post-date">
          {formatDate(post.record?.createdAt)}
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
                <div className="embed-title">{post.embed.external?.title}</div>
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
          <button onClick={handleOpenReplyModal}>
            <TbMessage size={20} strokeWidth={1.5} />
            <span>{post.replyCount}</span>
          </button>
        </div>
        <div className="post-action">
          <button onClick={handleRepost}>
            <TbRepeat size={20} strokeWidth={1.5} />
            <span>{post.repostCount}</span>
          </button>
        </div>
        <div className="post-action">
          <button
            onClick={likePost}
            className={classNames({ active: isLiked })}
          >
            <TbHeart size={20} strokeWidth={1.5} />
            <span>{post.likeCount}</span>
          </button>
        </div>
      </div>
      {replyModalOpen && (
        <Modal open={true}>
          <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reply-modal-header">
              <h4>Reply to {post.author.displayName}</h4>
              <div className="bsky-post">
                <div className="bsky-avatar">
                  <img src={post.author.avatar} alt={post.author.displayName} />
                </div>
                <div className="bsky-post-info">
                  <div className="post-username">
                    <span className="username">{post.author.displayName}</span>
                    <span className="username-handle">
                      @{post.author.handle}
                    </span>
                  </div>
                  <div className="post-text">{post.record.text}</div>
                </div>
                <div className="bsky-post-date">
                  {formatDate(post.record?.createdAt)}
                </div>
              </div>
              <div className="reply-container">
                <h5>Reply to {post.author.displayName}</h5>
                <form onSubmit={handleReply}>
                  <textarea
                    placeholder="Write a reply"
                    name="replyText"
                    required
                  />
                  <div className="reply-actions">
                    <button type="button" onClick={handleCloseReplyModal}>
                      Cancel
                    </button>
                    <button type="submit" className="reply-btn">
                      Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
