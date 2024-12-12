'use client';
import React, { useState } from 'react';
import { TbLogout } from 'react-icons/tb';

export default function UserAvatar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div className="user-avatar">
      <div
        className="avatar"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      ></div>
      {isDropdownOpen && (
        <div className="avatar-dropdown">
          <button>
            <TbLogout size={24} />
            <span>Logout</span>
          </button>
          <button>
            <TbLogout size={24} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
