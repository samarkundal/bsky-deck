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

async function prepareQueryFn(column) {
  if (column?.columnType === 'getFeed') {
    if (column.params.feed) {
      return axios
        .get('https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed', {
          params: column.params,
        })
        .then((res) => res.data);
    }
    return {
      feed: [],
      cursor: null,
    };
  }
  if (column?.columnType === 'searchPosts') {
    return axios
      .get('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts', {
        params: {
          ...column.params,
          q: column?.params?.query,
          sort: 'top',
        },
      })
      .then(({ data }) => {
        return {
          feed: data.posts.map((post) => ({ post })),
          cursor: data.cursor,
        };
      });
  }

  if (column?.columnType === 'hashtagPosts') {
    return axios
      .get('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts', {
        params: {
          q: column?.params?.tags.map((tag) => `#${tag}`).join(' '),
          sort: 'top',
        },
      })
      .then(({ data }) => {
        return {
          feed: data.posts.map((post) => ({ post })),
          cursor: data.cursor,
        };
      });
  }

  if (column.columnType === 'whatsHot') {
    return axios
      .get('http://localhost:3040/api/bsky/data', {
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
      .get('http://localhost:3040/api/bsky/data', {
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
  return null;
}

const checkIfColumnRequiresSetup = (column) => {
  if (column.columnType === 'searchPosts') {
    return !column.params?.query;
  }
  if (column.columnType === 'hashtagPosts') {
    return !column.params?.tags.length;
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
    return '';
  };

  const width = column.size || defaultWidth;
  return (
    <div className="column" style={{ width, minWidth: width }}>
      <div className="column-header">
        <div className="column-title">
          <span className="column-title-text">{column.title}</span>
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
          {column.feedType === 'posts' && <PostFeed feed={feed} />}
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
