import React from 'react';
import ConnectAccountModal from './ConnectAccountModal/ConnectAccountModal';
import { MODALS, useUi } from '@/context/ui.context';
import SettingsModal from './SettingsModal/SettingsModal';

export default function ModalWrapper() {
  const { modals } = useUi();
  const showConnectAccountModal = modals?.[MODALS.CONNECT_ACCOUNT];
  const showSettingsModal = modals?.[MODALS.SETTINGS];

  return (
    <div>
      {showSettingsModal && <SettingsModal />}
      {showConnectAccountModal && <ConnectAccountModal />}
    </div>
  );
}
