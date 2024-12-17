import Link from 'next/link';
import React, { useEffect } from 'react';
import { TbHome, TbPencil, TbSettings } from 'react-icons/tb';
import './Sidebar.scss';
import UserAvatar from '../UserAvatar/UserAvatar';
import { getAccounts, getSessionUser } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/auth.context';

export default function Sidebar() {
  const { setUser } = useAuth();
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: () => getSessionUser(),
  });
  const user = userData?.user;
  const accounts = userData?.accounts;

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  return (
    <div className="sidebar-container">
      <div className="logo-container">
        <Link className="logo" href={'/'}>
          <img src="/bsky-deck.png" alt="bsky-deck" />
        </Link>
      </div>
      <ul></ul>
      {/* <ul className="nav">
        <li>
          <Link href="/">
            <TbHome size={24} />
          </Link>
        </li>
        <li>
          <button>
            <TbPencil size={24} />
          </button>
        </li>
      </ul> */}
    </div>
  );
}
