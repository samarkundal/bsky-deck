'use client';
import React, { useState } from 'react';
import {
  TbBell,
  TbColumns,
  TbColumns3,
  TbHash,
  TbHeart,
  TbHome,
  TbList,
  TbLock,
  TbLogin,
  TbMessageCircle,
  TbNews,
  TbSearch,
  TbUser,
  TbUserPlus,
} from 'react-icons/tb';
import './AddColumn.scss';
import classNames from 'classnames';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addColumn } from '@/services/api.service';

const ColumnOption = ({ icon, title, description, onClick, isLocked }) => {
  return (
    <div className="add-column-option" onClick={onClick}>
      <div className="add-column-icon">{icon}</div>
      <div className="add-column-info">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      {isLocked && (
        <div className="is-locked">
          <TbLock size={20} />
        </div>
      )}
    </div>
  );
};

const iconProps = {
  size: 20,
  color: '#000',
  strokeWidth: 1.5,
  opacity: 0.6,
};

const columns = [
  // {
  //   title: 'Feed Posts',
  //   description: 'View Posts from a public feed',
  //   type: 'feed',
  //   feedType: 'posts',
  //   columnType: 'getFeed',
  //   icon: <TbList {...iconProps} />,
  // },
  {
    title: 'Search Posts',
    description: 'Search Posts based on a query',
    type: 'feed',
    feedType: 'posts',
    columnType: 'searchPosts',
    icon: <TbSearch {...iconProps} />,
  },
  {
    title: 'Hashtag Posts',
    description: 'View Posts based on a hashtag',
    type: 'feed',
    feedType: 'posts',
    columnType: 'hashtagPosts',
    icon: <TbHash {...iconProps} />,
  },
  {
    title: 'Trending News',
    description: 'View trending news from around the world',
    type: 'feed',
    feedType: 'posts',
    columnType: 'getFeed',
    icon: <TbNews {...iconProps} />,
  },
  {
    title: 'My Timeline',
    description: 'View your home timeline',
    type: 'feed',
    feedType: 'posts',
    columnType: 'getTimeline',
    icon: <TbHome {...iconProps} />,
    isLocked: true,
  },
  {
    title: 'My Likes',
    description: 'View your liked posts',
    type: 'feed',
    feedType: 'posts',
    columnType: 'myLikes',
    icon: <TbHeart {...iconProps} />,
    isLocked: true,
  },
  {
    title: 'My Notifications',
    description: 'View your notifications',
    type: 'feed',
    feedType: 'posts',
    columnType: 'myNotifications',
    icon: <TbBell {...iconProps} />,
    isLocked: true,
  },
  // {
  //   type: 'divider',
  // },
  // {
  //   title: 'My Follows',
  //   description: 'View your follows',
  //   icon: <TbUserPlus {...iconProps} />,
  // },
  // {
  //   title: 'My Followers',
  //   description: 'View your followers',
  //   icon: <TbUserPlus {...iconProps} />,
  // },
  // {
  //   title: 'Recently Engaged with me',
  //   description: 'View posts recently engaged with you',
  //   icon: <TbMessageCircle {...iconProps} />,
  // },
  // {
  //   title: 'Recently Engaged with User',
  //   description: 'View posts recently engaged with a user',
  //   icon: <TbMessageCircle {...iconProps} />,
  // },
  // {
  //   title: 'User Feed',
  //   description: 'View a user feed',
  //   icon: <TbUser {...iconProps} />,
  // },
];

export default function AddColumn() {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const addColumnMutation = useMutation({
    mutationFn: addColumn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['columns'],
      });
      setIsOpen(false);
    },
  });

  const handleAddNewColumn = (column) => () => {
    if (column.isLocked) {
      return;
    }
    addColumnMutation.mutate({
      column: {
        title: column.title,
        type: column.type,
        size: 350,
        feedType: column.feedType,
        columnType: column.columnType,
      },
    });
  };

  return (
    <div className={classNames('add-column', { isopen: isOpen })}>
      {!isOpen && (
        <button onClick={() => setIsOpen(!isOpen)}>
          <TbColumns3 size={20} />
          <span>Add Column</span>
        </button>
      )}
      {isOpen && (
        <div className={'add-column-modal'}>
          <div className="add-column-modal-header">
            <h2>Add Column</h2>
          </div>
          {/* <div className="search-container">
            <label htmlFor="search">Search</label>
            <input type="text" id="search" placeholder="Search for a user" />
          </div> */}
          <div className="add-column-options">
            <h4>Choose a column type</h4>
            <div className="add-column-options-list">
              {columns.map((column, index) => {
                return column.type === 'divider' ? (
                  <div className="add-column-divider" key={index}>
                    <hr />
                  </div>
                ) : (
                  <ColumnOption
                    key={index}
                    icon={column.icon}
                    title={column.title}
                    description={column.description}
                    onClick={handleAddNewColumn(column)}
                    isLocked={column.isLocked}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
