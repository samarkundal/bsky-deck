'use client';
import React, { useEffect, useState } from 'react';
import { TbCheck, TbCopy, TbSettings, TbTrash, TbX } from 'react-icons/tb';
import './Column.scss';
import axios from 'axios';
import BskyPost from '../BskyPost/BskyPost';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PostFeed from '../PostFeed/PostFeed';
import UserFeed from '../UserFeed/UserFeed';
import classNames from 'classnames';
import { updateColumn } from '@/services/api.service';
import Loader from '@/components/core/Loader/Loader';

const ColumnSizeOptions = [
  {
    label: 'Small (350px)',
    value: 350,
  },
  {
    label: 'Medium (450px)',
    value: 450,
  },
  {
    label: 'Large (550px)',
    value: 550,
  },
];

const postTypes = [
  {
    label: 'Quotes',
    value: 'quotes',
  },
  {
    label: 'Reposts',
    value: 'reposts',
  },
  {
    label: 'Media',
    value: 'media',
  },
  {
    label: 'Links',
    value: 'links',
  },
];

const CheckboxOption = ({ label, value, checked, onChange }) => {

  return (
    <div
      className={classNames('checkbox-option', {
        checked: checked,
      })}
      onClick={() => {
        onChange(value);
      }}
    >
      <label>{label}</label>
      <span className="checkbox">{checked && <TbCheck size={16} />}</span>
    </div>
  );
};

const CheckboxOptions = ({ options, key, onChange, isMultiple, value }) => {

  const [selectedValues, setSelectedValues] = useState(value);

  const handleCheckboxChange = (value) => {
    let updatedValues = [];
    if (isMultiple) {
      updatedValues = [...selectedValues, value];
    } else {
      updatedValues = value;
    }
    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  return (
    <div className="checkbox-options">
      {options.map((option) => (
        <CheckboxOption
          key={option.value}
          label={option.label}
          value={option.value}
          checked={isMultiple ? selectedValues.includes(option.value) : selectedValues === option.value}
          onChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
};

export default function Column({ column }) {
  const defaultWidth = window.innerWidth / 4;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  async function prepareQueryFn(column) {
    if (column?.columnType === 'getFeed') {
      return axios
        .get('https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed', {
          params: column.params,
        })
        .then((res) => res.data);
    }
    return null;
  }

  const {
    data = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ['feed', column?.title],
    queryFn: () => prepareQueryFn(column),
  });
  const feed = data?.feed || [];
  const cursor = data?.cursor;

  const queryClient = useQueryClient();
  const updateColumnMutation = useMutation({
    mutationFn: (data) => updateColumn(data),
    onSuccess: () => {
      console.log('invalidating columns');
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
  });

  const handleColumnSizeChange = (value) => {
    updateColumnMutation.mutate({
      columnId: column._id,
      update: {
        size: value,
      },
    });
  };

  return (
    <div className="column" style={{ width: column.size || defaultWidth }}>
      <div className="column-header">
        <div className="column-title">{column.title}</div>
        <div className="column-actions">
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
      <div className="column-content">
        <div className="column-feed">
          {column.feedType === 'posts' && <PostFeed feed={feed} />}
          {column.feedType === 'users' && <UserFeed feed={feed} />}
        </div>
      </div>
      {isSettingsOpen && (
        <div className="column-settings">
          <button
            className="close-icon"
            onClick={() => setIsSettingsOpen(false)}
          >
            <TbX size={20} />
          </button>
          <div className="single-setting">
            <h4>Column Size</h4>
            <CheckboxOptions
              options={ColumnSizeOptions}
              key="column-size"
              onChange={handleColumnSizeChange}
              isMultiple={false}
              value={column.size}
            />
          </div>
          <div className="single-setting">
            <h4>Post Type</h4>
            <CheckboxOptions options={postTypes} onChange={() => {}} />
          </div>

          <div className="column-actions-list">
            <div className="single-column-action">
              <TbCopy size={20} />
              <div className="single-column-action-label">Copy Column</div>
            </div>
            <div className="single-column-action delete-column">
              <TbTrash size={20} />
              <div className="single-column-action-label">Delete Column</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
