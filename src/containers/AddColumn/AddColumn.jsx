'use client';
import React, { useState } from 'react';
import { TbColumns, TbColumns3, TbHeart, TbList } from 'react-icons/tb';
import './AddColumn.scss';
import classNames from 'classnames';

const ColumnOption = ({ icon, title, description }) => {
  return (
    <div className="add-column-option">
      <div className="add-column-icon">{icon}</div>
      <div className="add-column-info">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default function AddColumn() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={classNames('add-column', { isopen: isOpen })}>
      {!isOpen && (
        <button onClick={() => setIsOpen(!isOpen)}>
          <TbColumns3 size={20} />
          <span>Add Column</span>
        </button>
      )}
      {isOpen && (
        <div className={"add-column-modal"}>
          <div className="add-column-modal-header">
            <h2>Add Column</h2>
          </div>
          <div className="search-container">
            <label htmlFor="search">Search</label>
            <input type="text" id="search" placeholder="Search for a user" />
          </div>
          <div className="add-column-options">
            <h4>Choose a column type</h4>
            <div className="add-column-options-list">
              <ColumnOption
                icon={<TbList size={20} />}
                title="Feed"
                description="View your feed"
              />
              <ColumnOption
                icon={<TbHeart size={20} />}
                title="My Likes"
                description="View your liked posts"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
