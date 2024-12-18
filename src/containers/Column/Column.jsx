'use client';
import React, { useEffect, useState } from 'react';
import { TbPlayerPlay, TbSettings } from 'react-icons/tb';
import './Column.scss';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import PostFeed from '../PostFeed/PostFeed';
import UserFeed from '../UserFeed/UserFeed';
import Loader from '@/components/core/Loader/Loader';
import ColumnSettings from './ColumnSettings';
import classNames from 'classnames';

async function prepareQueryFn(column) {
  if (column?.columnType === 'getFeed') {
    return axios.get('/api/bsky/fetch/trendingNews').then((res) => res.data);
  }
  if (column?.columnType === 'searchPosts') {
    return axios
      .get('/api/bsky/fetch/searchPosts', {
        params: {
          query: column?.params?.query,
        },
      })
      .then((res) => res.data);
  }

  if (column?.columnType === 'hashtagPosts') {
    return axios
      .get('/api/bsky/fetch/searchPosts', {
        params: {
          query: column?.params?.tags.map((tag) => `#${tag}`).join(' '),
        },
      })
      .then((res) => res.data);
  }

  if (column.columnType === 'whatsHot') {
    return axios
      .get('/api/bsky/data', {
        params: {
          query: 'myFeed',
        },
      })
      .then((res) => {
        console.log('feed', res.data.data.feed);
        return {
          feed: res.data.data.feed,
          cursor: null,
        };
      });
  }
  if (column.columnType === 'myLikes') {
    return axios
      .get('/api/bsky/data', {
        params: {
          query: 'myLikes',
        },
      })
      .then((res) => {
        console.log('feed', res.data.data.feed);
        return {
          feed: res.data.data.feed,
          cursor: null,
        };
      });
  }
  if (column.columnType === 'profilePosts') {
    return axios
      .get('/api/bsky/fetch/profilePosts', {
        params: {
          actors: column.params.users.map((user) => user.value),
        },
      })
      .then((res) => res.data);
  }
  if(column.columnType === 'userFeeds'){
    return axios.get('/api/bsky/fetch/userFeeds', {
      params: {
        feed: column.params.feed?.value,
      },
    }).then((res) => res.data);
  }
  return null;
}

const checkIfColumnRequiresSetup = (column) => {
  if (column.columnType === 'searchPosts') {
    return !column.params?.query;
  }
  if (column.columnType === 'hashtagPosts') {
    return !column.params?.tags.length;
  }
  if (column.columnType === 'profilePosts') {
    return !column.params?.users.length;
  }
  if(column.columnType === 'userFeeds'){
    return !column.params?.feed?.value;
  }
  return false;
};

export default function Column({ column }) {
  const defaultWidth = window.innerWidth / 4;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const requireSetup = checkIfColumnRequiresSetup(column);

  const {
    data = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ['feed', column?.columnName],
    queryFn: () => prepareQueryFn(column),
    enabled: !requireSetup,
  });
  const feed = data?.feed || [];
  const cursor = data?.cursor;

  const getColumnMetaInfo = () => {
    if (column.columnType === 'searchPosts') {
      return column.params?.query;
    }
    if (column.columnType === 'hashtagPosts') {
      return column.params?.tags.map((tag) => `#${tag}`).join(', ');
    }
    if (column.columnType === 'profilePosts') {
      return column.params?.users.map((user) => user.label).join(', ');
    }
    if(column.columnType === 'userFeeds'){
      return `User Feed`;
    }
    return '';
  };

  const getColumnTitle = () => {
    if(column.columnType === 'userFeeds'){
      return column.params?.feed?.label;
    }
    return column.title;
  };

  const width = column.size || defaultWidth;

  useEffect(() => {
    if (isSettingsOpen) {
      document.querySelector('.core-layout').classList.add('overshadow');
    } else {
      document.querySelector('.core-layout').classList.remove('overshadow');
    }
  }, [isSettingsOpen]);

  return (
    <div className={classNames("column", {
      'is-settings-active': isSettingsOpen,
    })} style={{ width, minWidth: width }}>
      <div className="column-header">
        <div className="column-title">
          <span className="column-title-text">{getColumnTitle()}</span>
          <span className="column-title-info">{getColumnMetaInfo()}</span>
          {/* {column.columnType === 'searchPosts' || column.columnType === 'hashtagPosts' && (
          )} */}
        </div>
        <div className="column-actions">
          {/* <button className="column-action-button">
            <TbPlayerPlay size={16} />
            <span>Run</span>
          </button> */}
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <TbSettings size={20} />
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="column-loader">
          <Loader />
        </div>
      )}
      {requireSetup && (
        <div className="column-setup">
          <h2>Setup this column</h2>
          <p>
            This column requires setup. Please click the button below to setup
            this column.
          </p>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            Setup
          </button>
        </div>
      )}
      <div className="column-content">
        <div className="column-feed">
          {column.feedType === 'posts' && <PostFeed feed={feed} columnId={column._id} />}
          {column.feedType === 'users' && <UserFeed feed={feed} />}
        </div>
      </div>
      {isSettingsOpen && (
        <ColumnSettings
          column={column}
          onHide={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
