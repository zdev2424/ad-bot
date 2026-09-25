import React from 'react';

export default function Logo({ size = 32, className = '' }) {
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
          <stop offset="100%" stopColor="#060b18" />
        </linearGradient>

        <linearGradient id="compNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <linearGradient id="compSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Frame */}
      <rect x="28" y="28" width="456" height="456" rx="112" fill="url(#compBgGrad)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="8" />

      {/* Tech Orbit */}
      <circle cx="256" cy="256" r="162" fill="none" stroke="url(#compNeonGrad)" strokeWidth="6" strokeDasharray="28 14" opacity="0.6" />

      {/* Stylized E Emblem */}
      <path
        d="M 330 156 L 206 156 C 168 156 142 186 142 224 L 142 288 C 142 326 168 356 206 356 L 330 356 C 342 356 350 346 350 334 C 350 322 342 314 330 314 L 214 314 C 196 314 186 302 186 288 L 186 224 C 186 210 196 198 214 198 L 330 198 C 342 198 350 188 350 177 C 350 165 342 156 330 156 Z"
        fill="url(#compNeonGrad)"
      />

      {/* Lightning Energy Bar */}
      <path
        d="M 186 240 L 300 240 L 270 272 L 344 272 L 254 360 L 274 292 L 210 292 Z"
        fill="url(#compNeonGrad)"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Golden Reward Spark */}
      <path
        d="M 360 148 Q 360 168 380 168 Q 360 168 360 188 Q 360 168 340 168 Q 360 168 360 148 Z"
        fill="url(#compSparkGrad)"
      />

      {/* Accent Dots */}
      <circle cx="152" cy="152" r="8" fill="#38bdf8" />
      <circle cx="368" cy="358" r="8" fill="#10b981" />
    </svg>
  );
}
