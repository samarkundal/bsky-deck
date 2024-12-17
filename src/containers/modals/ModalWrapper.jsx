import React from 'react';
import ConnectAccountModal from './ConnectAccountModal/ConnectAccountModal';
import { MODALS, useUi } from '@/context/ui.context';

export default function ModalWrapper() {
  const { modals } = useUi();
  const showConnectAccountModal = modals?.[MODALS.CONNECT_ACCOUNT];

  return <div>{showConnectAccountModal && <ConnectAccountModal />}</div>;
}
