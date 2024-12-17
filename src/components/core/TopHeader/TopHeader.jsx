'use client';
import React, { useState } from 'react';
import './TopHeader.scss';
import Modal from '@/components/ui/Modal/Modal';
import { useMutation } from '@tanstack/react-query';
import { addAccount } from '@/services/api.service';
import { TbHelp, TbMoon, TbPlug, TbPlus, TbSettings, TbShare } from 'react-icons/tb';
import UserAvatar from '../UserAvatar/UserAvatar';

export default function TopHeader() {
  return (
    <div className="top-header">
      <div className="left-header">
        <div className="deck-title">Default Deck</div>
        <div className="deck-actions">
          <button>
            <TbPlus size={18} />
            <span>Add Column</span>
          </button>
          <button>
            <TbShare size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
      <div className="right-sidebar">
        <div className="right-sidebar-item">
          <TbMoon size={22} />
        </div>
        <div className="right-sidebar-item">
          <TbHelp size={22} />
        </div>
        <div className="right-sidebar-item">
          <TbSettings size={22} />
        </div>
        <div className="account-dropdown">
          <UserAvatar />
        </div>
      </div>
      {/* <p>Connect your Bsky account to get started</p>
      <button onClick={() => setIsShowingModal(true)}>Connect Account</button> */}
    </div>
  );
}
