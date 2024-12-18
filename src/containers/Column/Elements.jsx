import axios from 'axios';
import React, { useState } from 'react';
import { TbPlus, TbSearch, TbX } from 'react-icons/tb';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import './Elements.scss';
import { useQuery } from '@tanstack/react-query';

export function SearchInput({ value, onSearch }) {
  const [searchValue, setSearchValue] = useState(value);

  const handleSubmit = () => {
    if (searchValue.trim() === '') return;
    onSearch(searchValue);
  };

  return (
    <div className="search-input">
      <input
        type="text"
        value={searchValue}
        placeholder="Enter a search query"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button onClick={handleSubmit}>
        <TbSearch size={20} />
      </button>
    </div>
  );
}

export function HashtagInput({ value, onChange }) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(value || []);

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    if (tags.includes(tagInput)) return;
    const tagValue = tagInput.trim().toLowerCase().replace('#', '');
    setTags([...tags, tagValue]);
    onChange([...tags, tagValue]);
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    onChange(newTags);
  };

  return (
    <div className="hastag-wrapper">
      <div className="hashtag-input">
        <input
          type="text"
          value={tagInput}
          placeholder="Enter a hashtag"
          onChange={(e) => setTagInput(e.target.value)}
        />
        <button onClick={handleAddTag}>
          <TbPlus size={20} />
        </button>
      </div>
      <div className="hashtags">
        {tags.map((tag) => (
          <div className="single-hashtag">
            <span>#{tag}</span>
            <span className="close-btn" onClick={() => handleRemoveTag(tag)}>
              <TbX size={15} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const SelectInput = ({ options, value, onChange }) => {
  return (
    <div className="select-input">
      <Select options={options} value={value} onChange={onChange} />
    </div>
  );
};

export const SelectUserAccounts = ({ value, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(value || []);

  const loadOptions = async (inputValue) => {
    if(!inputValue || inputValue.trim() === '') return [];
    try {
      const response = await axios.get(
        `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${inputValue}`
      );
      const { actors = []} = response.data;
      return actors.map(user => ({
        value: user.did,
        label: user.displayName,
        avatar: user.avatar
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const formatOptionLabel = ({ label, value, avatar }) => {
    return <div className="select-user-accounts-option">
      <div className="select-user-accounts-option-avatar">
        { avatar && <img src={avatar} alt={label} /> }
      </div>
      <div className="select-user-accounts-option-label">
        <span>{label}</span>
      </div>
    </div>;
  };

  const handleSelectUpdate = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    onChange(selectedOptions);
  };

  return (
    <div className="select-user-accounts select-input">
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        placeholder="Search users..."
        isMulti={true}
        value={selectedOptions}
        formatOptionLabel={formatOptionLabel}
        onChange={handleSelectUpdate}
      />
    </div>
  );
};

export const SelectFeeds = ({ value, onChange }) => {
  const { data: feeds = [] } = useQuery({
    queryKey: ['feeds'],
    queryFn: () => axios.get('https://public.api.bsky.app/xrpc/app.bsky.feed.getSuggestedFeeds').then((res) => res.data?.feeds),
  });

  const options = feeds?.map((feed) => ({
    value: feed.uri,
    label: feed.displayName,
    description: feed.description,
  }));

  const formatOptionLabel = ({ label, value, description }) => {
    return <div className="select-feed-option">
      <div className="select-feed-option-label">
        <span>{label}</span>
      </div>
      <div className="select-feed-option-description">
        <span>{description}</span>
      </div>
    </div>;
  };

  console.log('feeds', feeds);
  return <div className="select-input">
    <Select options={options} value={value} onChange={onChange} formatOptionLabel={formatOptionLabel} />
  </div>
};