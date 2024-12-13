import React, { useState } from 'react';
import { TbPlus, TbSearch, TbX } from 'react-icons/tb';

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
