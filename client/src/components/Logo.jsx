import React from 'react';

export default function Logo({ size = 36, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="compBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b1329" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#050a18" />
        </linearGradient>

        <linearGradient id="compRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <linearGradient id="compGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        <linearGradient id="compPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      <rect x="24" y="24" width="464" height="464" rx="108" fill="url(#compBgGrad)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="8" />
      <circle cx="256" cy="256" r="168" fill="none" stroke="url(#compRingGrad)" strokeWidth="6" strokeDasharray="24 12" opacity="0.7" />
      <circle cx="256" cy="256" r="148" fill="#131e38" stroke="url(#compGoldGrad)" strokeWidth="12" />
      <circle cx="256" cy="256" r="126" fill="#0d1527" stroke="url(#compGoldGrad)" strokeWidth="3" strokeDasharray="6 6" opacity="0.8" />
      <polygon points="220,186 330,256 220,326" fill="url(#compPlayGrad)" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="350" cy="160" r="10" fill="#38bdf8" />
      <circle cx="150" cy="340" r="8" fill="#10b981" />
      <circle cx="370" cy="320" r="8" fill="#fbbf24" />
    </svg>
  );
}
