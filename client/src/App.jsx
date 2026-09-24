import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import LanguageSelector from './components/LanguageSelector';
import DashboardView from './views/DashboardView';
import TasksView from './views/TasksView';
import ReferralView from './views/ReferralView';
import WithdrawView from './views/WithdrawView';
import LeaderboardView from './views/LeaderboardView';
import AdminView from './views/AdminView';
import { Sparkles, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { user, setUser, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

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
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading EarnCashIO...</p>
        </div>
      </div>
    );
  }

  // Interactive handler for ad completion
  const handleAdCompleted = (slotNum, updatedUser) => {
    if (updatedUser) {
      setUser((prev) => ({
        ...prev,
        ...updatedUser
      }));
    } else {
      setUser((prev) => {
        if (!prev) return prev;
        const newAdsToday = (prev.adsWatchedToday || 0) + 1;
        const newAdsTotal = (prev.adsWatchedTotal || 0) + 1;
        const newBalance = (prev.balance || 0) + 0.005;
        const newTotalEarned = (prev.totalEarned || 0) + 0.005;
        return {
          ...prev,
          adsWatchedToday: newAdsToday,
          adsWatchedTotal: newAdsTotal,
          balance: parseFloat(newBalance.toFixed(4)),
          totalEarned: parseFloat(newTotalEarned.toFixed(4)),
          eligibility: {
            ...prev.eligibility,
            adsWatched: newAdsTotal,
            isEligible: newAdsTotal >= 20 && (prev.referralCount || 0) >= 10
          }
        };
      });
    }
  };

  // Interactive handler for withdrawal status flip
  const handleWithdrawalStatusChange = (newStatus) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        withdrawalStatus: newStatus
      };
    });
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', background: 'rgba(10, 14, 23, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 90 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', color: '#fff' }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EarnCashIO
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {user?.isAdmin && (
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'dashboard' : 'admin')}
              style={{
                background: activeTab === 'admin' ? 'var(--accent-rose)' : 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: activeTab === 'admin' ? '#fff' : 'var(--accent-rose)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ADMIN
            </button>
          )}

          <div className="badge badge-blue">
            ${user?.balance?.toFixed(2) || '0.00'}
          </div>
        </div>
      </header>

      {/* Main View Switcher */}
      <main style={{ padding: '16px 16px 20px', flex: 1 }}>
        {activeTab === 'dashboard' && <DashboardView user={user} setActiveTab={setActiveTab} />}
        {activeTab === 'tasks' && <TasksView user={user} onAdCompleted={handleAdCompleted} />}
        {activeTab === 'refer' && <ReferralView user={user} />}
        {activeTab === 'withdraw' && <WithdrawView user={user} onStatusChange={handleWithdrawalStatusChange} />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'admin' && <AdminView user={user} />}
      </main>

      {/* Bottom Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={user?.isAdmin} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
