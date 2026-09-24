import React, { useEffect, useState } from 'react';

export default function App() {
  const [initData, setInitData] = useState(null);

  useEffect(() => {
    // Check if running inside Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      setInitData(tg.initDataUnsafe?.user || null);
    }
  }, []);

  return (
    <div className="app-container">
      <header style={{ padding: '20px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          EarnCashIO
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Watch Ads • Refer Friends • Earn Crypto
        </p>
      </header>

      <main style={{ padding: '0 16px 80px', flex: 1 }}>
        <div className="glass-card" style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Welcome</p>
          <h2 style={{ fontSize: '18px', marginTop: '4px' }}>
            {initData ? `${initData.first_name} ${initData.username ? `(@${initData.username})` : ''}` : 'Telegram User (Preview Mode)'}
          </h2>
          <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '600' }}>Module 1 Setup Completed</span>
          </div>
        </div>
      </main>
    </div>
  );
}
