'use client';
import { clearSessionFromLocalStorage, getAccounts } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { TbLogout, TbPlus } from 'react-icons/tb';
import './UserAvatar.scss';
import { MODALS, useUi } from '@/context/ui.context';
import { useAuth } from '@/context/auth.context';
import classNames from 'classnames';

export default function UserAvatar({}) {
  const { user } = useAuth();
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
  });
  const sortedAccounts = [...accounts.filter((account) => account.currentlyActive), ...accounts.filter((account) => !account.currentlyActive)];
  const isConnected = user?.isConnected;
  const { showModal } = useUi();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectAccount = (account) => {
    setIsDropdownOpen(false);
  };

  const showConnectAccountModal = () => {
    showModal(MODALS.CONNECT_ACCOUNT);
  };

  if (!isConnected) {
    return (
      <div className="user-avatar-not-logged-in">
        <button onClick={showConnectAccountModal}>Connect Account</button>
      </div>
    );
  }

  const logout = () => {
    clearSessionFromLocalStorage();
    window.location.reload();
  };

  return (
    <div className="user-avatar">
      <div
        className="avatar-trigger"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="img-avatar">
          <img src={user.avatar} alt="avatar" />
        </div>
        <div className="avatar-info">
          <h4>{user.displayName || '-'}</h4>
          <p>@{user.handle || '-'}</p>
        </div>
      </div>
      {isDropdownOpen && (
        <div className="avatar-dropdown">
          <h5>Connected Accounts ({sortedAccounts.length})</h5>
          <div className="connected-accounts">
            {sortedAccounts?.map((account) => (
              <div
                className={classNames("account-item", {
                  active: account.currentlyActive,
                })}
                key={account._id}
                onClick={() => handleSelectAccount(account)}
              >
                <div className="img-avatar">
                  {account.avatar ? <img src={account.avatar} alt="avatar" /> : <div className="avatar-placeholder"></div>}
                </div>
                <div className="account-info">
                  <h4>{account.displayName || '-'}</h4>
                  <p>@{account.handle || '-'}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="dropdown-action" onClick={showConnectAccountModal}>
            <TbPlus size={20} />
            <span>Add Account</span>
          </button>
          <button className="dropdown-action" onClick={logout}>
            <TbLogout size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
