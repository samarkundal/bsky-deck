'use client';
import React from 'react';
import profiles from '@/../data/profiles.json';
import { Table } from 'antd';
import './profiles.scss';
import { TbExternalLink } from 'react-icons/tb';

export default function page() {
  const rankedProfiles = profiles.map((profile, index) => ({
    ...profile,
    rank: index + 1,
  }));
  return (
    <div className="internal-profile-pages">
      <Table
        dataSource={rankedProfiles}
        columns={[
          {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 50,
            sorter: (a, b) => a.rank - b.rank,
          },
          {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record) => (
              <div
                className="avatar-container"
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <img className="avatar-img" src={text} alt="avatar" />
                <div className="avatar-name">{record.displayName}</div>
              </div>
            ),
            width: 100,
          },
          {
            title: 'Followers',
            dataIndex: 'followersCount',
            key: 'followersCount',
            width: 100,
            sorter: (a, b) => a.followersCount - b.followersCount,
          },
          {
            title: 'Following',
            dataIndex: 'followsCount',
            key: 'followsCount',
            width: 100,
            sorter: (a, b) => a.followsCount - b.followsCount,
          },
          {
            title: 'Posts',
            dataIndex: 'postsCount',
            key: 'postsCount',
            width: 100,
            sorter: (a, b) => a.postsCount - b.postsCount,
          },
          {
            title: 'Count',
            dataIndex: 'count',
            key: 'count',
            width: 50,
            sorter: (a, b) => a.count - b.count,
          },
          {
            title: 'Handle',
            dataIndex: 'handle',
            key: 'handle',
            render: (text, record) => (
              <a
                href={`https://bsky.app/profile/${text}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                {text}
                <TbExternalLink size={16} />
              </a>
            ),
            width: 120,
          },
        ]}
        pagination={false}
        sortDirections={['ascend', 'descend']}
      />
    </div>
  );
}
