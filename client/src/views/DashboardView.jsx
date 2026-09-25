import React, { useEffect, useState } from 'react';
import { Sparkles, Tv, Users, Wallet, ArrowUpRight, CheckCircle2, TrendingUp, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { dashboardApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

export default function DashboardView({ user, setActiveTab, onOpenTerms }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveStats = async () => {
    triggerHaptic('light');
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

  const handleCardNav = (tab) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* User Welcome & Refresh Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 2px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t('dashboard.welcome')}</span>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {user?.firstName || 'EarnCashIO Earner'} 👋
          </h2>
        </div>
        <button
          onClick={fetchLiveStats}
          disabled={refreshing}
          style={{
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.28)',
            color: 'var(--accent-cyan)',
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            touchAction: 'manipulation'
          }}
        >
          <RefreshCw size={12} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? t('syncing') : t('sync')}
        </button>
      </div>

      {/* Main Balance Hero Card */}
      <div
        className="glass-card"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderTop: '1px solid var(--border-specular)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            {t('dashboard.currentBalance')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '14px' }}>
          <span className="tabular-nums" style={{ fontSize: '38px', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', color: '#ffffff' }}>
            ${balance.toFixed(3)}
          </span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>USD</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('dashboard.totalEarned')}</span>
            <p className="tabular-nums" style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>
              ${totalEarned.toFixed(3)}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('dashboard.withdrawalStatus')}</span>
            <p style={{ fontSize: '13px', fontWeight: '700', textTransform: 'capitalize', marginTop: '2px', color: (stats?.withdrawalStatus || user?.withdrawalStatus) === 'pending' || (stats?.withdrawalStatus || user?.withdrawalStatus) === 'in_queue' ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
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
            <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{t('dashboard.dailySlots')}</h4>
          </div>
          <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-blue)' }}>
            {adsWatchedToday} / {maxDailyAds}
          </span>
        </div>

        <div className="progress-bar-bg" style={{ marginBottom: '10px' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {t('dashboard.adRate')}
          </span>
          <button
            onClick={() => handleCardNav('tasks')}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', touchAction: 'manipulation' }}
          >
            {t('dashboard.watchNow')} <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid with Tactile Haptics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card glass-card-interactive" onClick={() => handleCardNav('refer')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Users size={18} color="var(--accent-purple)" />
            <span className="badge badge-blue">{t('dashboard.refRate')}</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('dashboard.friendsInvited')}</span>
          <p className="tabular-nums" style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px' }}>{referralCount}</p>
        </div>

        <div className="glass-card glass-card-interactive" onClick={() => handleCardNav('withdraw')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Wallet size={18} color="var(--accent-emerald)" />
            <span className={`badge ${ (stats?.eligibility?.isEligible ?? user?.eligibility?.isEligible) ? 'badge-emerald' : 'badge-amber'}`}>
              {(stats?.eligibility?.isEligible ?? user?.eligibility?.isEligible) ? 'Ready' : 'Progress'}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('dashboard.withdrawGate')}</span>
          <p className="tabular-nums" style={{ fontSize: '13px', fontWeight: '800', marginTop: '4px', color: (stats?.eligibility?.isEligible ?? user?.eligibility?.isEligible) ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
            {(stats?.eligibility?.isEligible ?? user?.eligibility?.isEligible) ? t('dashboard.unlocked') : `${adsWatchedToday}/20 Ads • ${referralCount}/10 Refs`}
          </p>
        </div>
      </div>

      {/* Platform Live Highlight */}
      {stats?.global && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 14px', background: 'rgba(15, 23, 42, 0.55)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('dashboard.adsServed')}</span>
            <p className="tabular-nums" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{stats.global.totalAdsServed}+</p>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('dashboard.earnersOnline')}</span>
            <p className="tabular-nums" style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{stats.global.totalActiveUsers || 1}</p>
          </div>
        </div>
      )}

      {/* Primary Action Button (Thumb Zone reachable) */}
      <button
        className="btn-primary"
        onClick={() => {
          triggerHaptic('medium');
          setActiveTab('tasks');
        }}
      >
        <Tv size={18} />
        {t('dashboard.ctaButton')}
      </button>

      {/* Terms & Privacy Footer Link */}
      {onOpenTerms && (
        <div style={{ textAlign: 'center', marginTop: '2px', paddingBottom: '8px' }}>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenTerms();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.85,
              touchAction: 'manipulation'
            }}
          >
            📜 <span>Terms of Service & Fair Play Rules</span>
          </button>
        </div>
      )}
    </div>
  );
}
