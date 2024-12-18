import Modal from '@/components/ui/Modal/Modal';
import React from 'react';
import './SettingsModal.scss';
import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/services/api.service';
import { TbPlus } from 'react-icons/tb';
import { MODALS, useUi } from '@/context/ui.context';

const ConnectedAccounts = () => {
  const { showModal, hideModal } = useUi();
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
  });

  const handleConnectNewAccount = () => {
    showModal(MODALS.CONNECT_ACCOUNT);
  };

  return (
    <div className="connected-accounts-container">
      <div className="head">
        <h4>Connected Accounts</h4>
        <button onClick={handleConnectNewAccount}>
          <TbPlus size={20} />
          <span>Connect New Account</span>
        </button>
      </div>
      <div className="connected-accounts">
        {accounts.map((account) => (
          <div className="connected-account-item" key={account._id}>
            <div className="img-avatar">
              <img src={account.avatar} alt="avatar" />
            </div>
            <div className="avatar-info">
              <h4>{account.displayName}</h4>
              <p>{account.handle}</p>
            </div>
            <div className="account-actions">
              <button>Disconnect</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SettingsModal() {
  const { hideModal } = useUi();

  const handleClose = () => {
    hideModal(MODALS.SETTINGS);
  };

  return (
    <Modal open={true} onClose={handleClose} width={800} title={'Settings'}>
      {/* <div className="setting-tabs">
        <div className="single-tab active">General</div>
        <div className="single-tab">Accounts</div>
        <div className="single-tab">About</div>
      </div> */}
      <div className="settings-details">
        <ConnectedAccounts />
      </div>
    </Modal>
  );
}
