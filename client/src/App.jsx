import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

function AppContent() {
  const { user, loading, isTelegramEnvironment } = useAuth();

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(59, 130, 246, 0.2)',
            borderTopColor: 'var(--accent-blue)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Authenticating with Telegram...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ padding: '24px 16px 12px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '10px' }}>
          <Sparkles size={14} color="var(--accent-cyan)" />
          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
            EarnCashIO • TMA
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
          EarnCashIO
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
          Watch Ads • Refer Friends • Earn Rewards
        </p>
      </header>

      {/* Main Content */}
      <main style={{ padding: '12px 16px 80px', flex: 1 }}>
        {/* Auth Status Card */}
        <div className="glass-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={20} color="var(--accent-emerald)" />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600' }}>Authenticated User</p>
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>
                  {user?.firstName} {user?.lastName} {user?.username ? `(@${user.username})` : ''}
                </h3>
              </div>
            </div>
            {user?.isAdmin && (
              <span style={{ padding: '4px 8px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', fontSize: '11px', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                ADMIN
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Telegram ID</span>
              <p style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'monospace' }}>{user?.telegramId}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Security Check</span>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> HMAC Verified
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Indicator */}
        <div className="glass-card" style={{ background: 'rgba(30, 41, 67, 0.4)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 10px var(--accent-emerald)' }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Module 2 — Telegram Auth Complete
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Signed Telegram <code style={{ color: 'var(--accent-cyan)' }}>initData</code> validation is active on the backend. Ready for database and user model.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
