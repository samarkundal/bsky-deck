import React from 'react';

export default function Loader({ size = 70 }) {
  return (
    <div className="loader">
      <img src="/svg/bars-loader.svg" alt="loader" style={{ width: size, height: size }} />
    </div>
  );
}
