'use client';
import React, { useEffect, useState } from 'react';
import './TopHeader.scss';
import Modal from '@/components/ui/Modal/Modal';
import { useMutation } from '@tanstack/react-query';
import { addAccount } from '@/services/api.service';
import { TbHelp, TbMoon, TbPlug, TbPlus, TbSettings, TbShare } from 'react-icons/tb';
import UserAvatar from '../UserAvatar/UserAvatar';
import { MODALS, useUi } from '@/context/ui.context';

export default function TopHeader() {
  const { showModal } = useUi();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const showAddColumn = () => {
    const container = document.querySelector('.main-container');
    container.scrollTo({
      left: container.scrollWidth,
      behavior: 'smooth',
    });
    document.querySelector('#add-column-button').click();
  }

  const showSettingsModal = () => {
    showModal(MODALS.SETTINGS);
  }

  useEffect(() => {
    const container = document.querySelector('html');
    if(isDarkMode){
      container.classList.add('dark');
    } else {
      container.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="top-header">
      <div className="left-header">
        <div className="deck-title">Default Deck</div>
        <div className="deck-actions">
          <button onClick={showAddColumn}>
            <TbPlus size={18} />
            <span>Add Column</span>
          </button>
          {/* <button>
            <TbShare size={18} />
            <span>Share</span>
          </button> */}
        </div>
      </div>
      <div className="right-sidebar">
        <div className="right-sidebar-item" onClick={() => setIsDarkMode(!isDarkMode)}>
          <TbMoon size={22} />
        </div>
        {/* <div className="right-sidebar-item">
          <TbHelp size={22} />
        </div> */}
        <div className="right-sidebar-item" onClick={showSettingsModal}>
          <TbSettings size={22} />
        </div>
        <div className="account-dropdown">
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}
