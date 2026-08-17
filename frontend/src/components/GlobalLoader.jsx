import React, { useState, useEffect } from 'react';
import fixmateLogo from '../assets/fixmate-logo.jpeg';

export default function GlobalLoader({ isLoading }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setFadeOut(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    setVisible(true);
    setFadeOut(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const next = prev + Math.floor(Math.random() * 15) + 8;
        return next > 95 ? 95 : next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`position-fixed top-0 start-0 w-100 h-100 bg-white d-flex flex-column align-items-center justify-content-center ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        zIndex: 9999,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: fadeOut ? 'none' : 'auto'
      }}
    >
      <div className="text-center px-4" style={{ maxWidth: '320px', width: '100%' }}>
        {/* FixMate Logo */}
        <div className="mb-3 d-inline-block">
          <img
            src={fixmateLogo}
            alt="FixMate"
            className="rounded-circle shadow-sm border border-2 border-light"
            style={{ width: '72px', height: '72px', objectFit: 'cover' }}
          />
        </div>

        {/* Brand Name */}
        <h4 className="fw-extrabold text-dark mb-3">
          Fix<span className="text-warning">Mate</span>
        </h4>

        {/* Percentage Indicator */}
        <div
          className="fw-bold text-primary mb-2"
          style={{ fontSize: '1.25rem', fontFamily: 'monospace' }}
        >
          {progress}%
        </div>

        {/* Progress Bar */}
        <div
          className="progress rounded-pill bg-light border shadow-sm mx-auto"
          style={{ height: '8px', maxWidth: '260px', overflow: 'hidden' }}
        >
          <div
            className="progress-bar bg-primary progress-bar-striped progress-bar-animated rounded-pill"
            role="progressbar"
            style={{
              width: `${progress}%`,
              transition: 'width 0.15s ease-out'
            }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  );
}
