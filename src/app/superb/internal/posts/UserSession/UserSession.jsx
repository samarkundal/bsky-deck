'use client';

import React, { useEffect, useState } from 'react';
import './UserSession.scss';
import { Button, Form, Input, Modal } from 'antd';
import { AtpAgent } from '@atproto/api';

const agent = new AtpAgent({
  service: 'https://bsky.social',
});

export default function UserSession() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = async (values) => {
    await agent.login({
      identifier: values.handle,
      password: values.password,
    }).then((res) => {
      const session = res.data;
      const { accessJwt, refreshJwt } = session;
      localStorage.setItem('bsky_handle', session.handle);
      localStorage.setItem('bsky_did', session.did);
      localStorage.setItem('bsky_accessJwt', accessJwt);
      localStorage.setItem('bsky_refreshJwt', refreshJwt);
      setIsModalOpen(false);
    });
  };

  useEffect(() => {
    const accessJwt = localStorage.getItem('bsky_accessJwt');
    const did = localStorage.getItem('bsky_did');
    const refreshJwt = localStorage.getItem('bsky_refreshJwt');
    if (accessJwt) {
      agent.resumeSession({ accessJwt, did, refreshJwt }).then((res) => {
        console.log(res);
        setUser(res.data);
      });
    }
  }, []);

  return (
    <div className="user-session">
      <div className="trigger">
        {user ? (
          <div className="user-info">
            {/* <img src={user.avatar} alt={user.displayName} /> */}
            <h3>Logged in as "{user.handle}"</h3>
          </div>
        ) : (
          <button onClick={() => setIsModalOpen(true)}>Connect User</button>
        )}
      </div>
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <Form layout='vertical' onFinish={handleSubmit}>
          <Form.Item label="Handle" name="handle">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
