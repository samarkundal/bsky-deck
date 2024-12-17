import Modal from '@/components/ui/Modal/Modal';
import { MODALS, useUi } from '@/context/ui.context';
import { addAccount } from '@/services/api.service';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

export default function ConnectAccountModal() {
  const { hideModal } = useUi();

  const addAccountMutation = useMutation({
    mutationFn: (data) => addAccount(data),
  });

  const handleHideModal = () => {
    hideModal(MODALS.CONNECT_ACCOUNT);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const { username, password } = data;
    console.log(username, password);
    addAccountMutation.mutate({ username, password });
  };

  return (
    <Modal onClose={handleHideModal} open={true} title="Connect Account">
      <form className="connect-account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            name="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            name="password"
          />
        </div>
        <div className="form-group">
          <button type="submit">Connect</button>
        </div>
      </form>
    </Modal>
  );
}
