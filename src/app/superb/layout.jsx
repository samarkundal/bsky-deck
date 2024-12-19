import React from 'react'
import './layout.scss';

export default function layout({ children }) {
  return (
    <div>
      <div className='superb-layout'>
        {children}
      </div>
    </div>
  )
}
