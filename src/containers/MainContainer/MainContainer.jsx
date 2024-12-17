'use client';
import React, { useEffect, useState } from 'react';
import './MainContainer.scss';
import Column from '../Column/Column';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import AddColumn from '../AddColumn/AddColumn';
import {
  getColumns,
  getSession,
  getSessionFromLocalStorage,
  storeSessionToLocalStorage,
} from '@/services/api.service';
import JoinWaitlist from './JoinWaitlist';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopHeader from '@/components/core/TopHeader/TopHeader';
import { useAuth } from '@/context/auth.context';

const columns = [
  {
    title: 'Trending News',
    type: 'feed',
    feedType: 'posts',
    query: {
      type: 'getFeed',
      params: {
        feed: 'at://did:plc:kkf4naxqmweop7dv4l2iqqf5/app.bsky.feed.generator/news-2-0',
        limit: 50,
      },
    },
  },
  {
    title: 'Trending News',
    type: 'feed',
    feedType: 'posts',
    query: {
      type: 'getFeed',
      params: {
        feed: 'at://did:plc:kkf4naxqmweop7dv4l2iqqf5/app.bsky.feed.generator/news-2-0',
        limit: 50,
      },
    },
  },
  // {
  //   title: 'Andrie\'s Posts',
  //   width: '450px',
  //   type: 'feed',
  // },
  // {
  //   title: 'Dashboard',
  //   width: '450px',
  //   type: 'feed',
  // },
  // {
  //   title: 'Feed',
  //   width: '450px',
  //   type: 'feed',
  // },
  // {
  //   title: 'Andrie\'s Posts',
  //   width: '450px',
  //   type: 'feed',
  // }
];
// const queryClient = new QueryClient();

const ColumnWrapper = ({ children }) => {
  const { data: columns = [], isLoading } = useQuery({
    queryKey: ['columns'],
    queryFn: () => getColumns(),
  });

  if (isLoading) {
    return (
      <div className="column-wrapper">
        <div className="column-wrapper-loader">
          <img src="/svg/bars-loader.svg" alt="loader" />
        </div>
      </div>
    );
  }

  return (
    <>
      {columns?.map((column) => (
        <Column key={column.columnName} column={column} />
      ))}
    </>
  );
};

export default function MainContainer() {
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();
  useEffect(() => {
    const session = getSessionFromLocalStorage();
    if (!session) {
      getSession().then(({ session, user }) => {
        storeSessionToLocalStorage(session);
        setLoading(false);
        setUser(session);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return '';
  }

  return (
    // <QueryClientProvider client={queryClient}>
      <div className="columns-wrapper">
        <TopHeader />
        <div className="columns-layout">
          <div className="main-container">
            <ColumnWrapper />
            <AddColumn />
            {/* <JoinWaitlist /> */}
            <ToastContainer />
          </div>
        </div>
      </div>
    // </QueryClientProvider>
  );
}
