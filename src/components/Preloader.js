import React from 'react';

export default function Preloader({ visible }) {
  return (
    <div className={`preloader ${visible ? 'preloader-visible' : 'preloader-hidden'}`}>
      <div className="preloader-inner">
        <img src="/logo.png" alt="Loading" className="preloader-logo" />
        <div className="preloader-spinner">
          <span className="preloader-dot" />
          <span className="preloader-dot" />
          <span className="preloader-dot" />
        </div>
        <span className="preloader-text">Загрузка…</span>
      </div>
    </div>
  );
}