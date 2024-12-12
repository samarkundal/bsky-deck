import Link from 'next/link';
import React from 'react'
import { TbHome, TbPencil, TbSettings} from "react-icons/tb";
import './Sidebar.scss';
import UserAvatar from './UserAvatar';

export default function Sidebar() {
  return (
    <div className='sidebar-container'>
      <div className="logo-container">
        <Link className="logo" href={'/'}>
          <img src='/bsky-deck.png' alt='bsky-deck' />
        </Link>
      </div>
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
      </ul>
      <ul className="bottom-nav">
        <li>
          <button>
            <TbSettings size={24} />
          </button>
        </li>
      </ul> */}
      {/* <UserAvatar /> */}
    </div>
  )
}
