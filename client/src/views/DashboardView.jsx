import React, { useEffect, useState } from 'react';
import { Sparkles, Tv, Users, Wallet, ArrowUpRight, CheckCircle2, TrendingUp, RefreshCw, Zap } from 'lucide-react';
import { dashboardApi } from '../services/api';

export default function DashboardView({ user, setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveStats = async () => {
    setRefreshing(true);
    try {
      const res = await dashboardApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Live stats fetch warning:', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const balance = stats?.balance ?? user?.balance ?? 0.00;
  const totalEarned = stats?.totalEarned ?? user?.totalEarned ?? 0.00;
  const adsWatchedToday = stats?.adsWatchedToday ?? user?.adsWatchedToday ?? 0;
  const referralCount = stats?.referralCount ?? user?.referralCount ?? 0;
  const maxDailyAds = stats?.maxDailyAds ?? 100;
  const progressPercent = Math.min(100, Math.round((adsWatchedToday / maxDailyAds) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* User Welcome & Refresh Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Welcome back,</span>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {user?.firstName || 'EarnCashIO Earner'} 👋
          </h2>
        </div>
        <button
          onClick={fetchLiveStats}
          disabled={refreshing}
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: 'var(--accent-cyan)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RefreshCw size={12} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Syncing...' : 'Sync'}
        </button>
      </div>

      {/* Main Balance Card */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%', filter: 'blur(30px)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
            Current Balance
          </span>
          <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={10} /> Live Synced
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '14px' }}>
          <span style={{ fontSize: '38px', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${balance.toFixed(3)}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>USD</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Earned</span>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              ${totalEarned.toFixed(3)}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Withdrawal Status</span>
            <p style={{ fontSize: '13px', fontWeight: '600', textTransform: 'capitalize', color: (stats?.withdrawalStatus || user?.withdrawalStatus) === 'pending' || (stats?.withdrawalStatus || user?.withdrawalStatus) === 'in_queue' ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
              {(stats?.withdrawalStatus || user?.withdrawalStatus) === 'none' ? 'Ready' : (stats?.withdrawalStatus || user?.withdrawalStatus || 'Ready')}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Ad Progress Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tv size={18} color="var(--accent-blue)" />
            <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Daily Ad Watch Slots</h4>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-blue)' }}>
            {adsWatchedToday} / {maxDailyAds}
          </span>
        </div>

        <div className="progress-bar-bg" style={{ marginBottom: '10px' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Earn $0.005 on every completed ad view
          </span>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            Watch Now <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card glass-card-interactive" onClick={() => setActiveTab('refer')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Users size={18} color="var(--accent-purple)" />
            <span className="badge badge-blue">+$0.05 / ref</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Friends Invited</span>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px' }}>{referralCount}</p>
        </div>

        <div className="glass-card glass-card-interactive" onClick={() => setActiveTab('withdraw')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Wallet size={18} color="var(--accent-emerald)" />
            <span className="badge badge-emerald">Instant Gate</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Withdrawal Gate</span>
          <p style={{ fontSize: '14px', fontWeight: '700', marginTop: '4px', color: (stats?.eligibility?.isEligible ?? user?.eligibility?.isEligible) ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
            {(stats?.eligibility?.isEligible ?? user?.eligibility?.isEligible) ? 'Unlocked 🎉' : `${adsWatchedToday}/20 Ads`}
          </p>
        </div>
      </div>

      {/* Platform Live Highlight */}
      {stats?.global && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 14px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Network Ads Served</span>
            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-cyan)' }}>{stats.global.totalAdsServed}+</p>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Earners Online</span>
            <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-emerald)' }}>{stats.global.totalActiveUsers || 1}</p>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <button className="btn-primary" onClick={() => setActiveTab('tasks')}>
        <Tv size={18} />
        Start Watching Ads & Earn
      </button>
    </div>
  );
}
