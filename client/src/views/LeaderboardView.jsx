import React, { useState, useEffect } from 'react';
import { Trophy, Flame, CheckCircle2, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { leaderboardApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function LeaderboardView() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await leaderboardApi.getData();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch leaderboard data:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  const fallbackWithdrawals = [
    { id: 1, user: 'user123**22', amount: '$3.00', time: '12m ago', method: 'M-Pesa', flag: '🇰🇪' },
    { id: 2, user: 'user489**01', amount: '$5.50', time: '38m ago', method: 'UPI', flag: '🇮🇳' },
    { id: 3, user: 'user782**90', amount: '$2.75', time: '1h ago', method: 'DANA', flag: '🇮🇩' },
    { id: 4, user: 'user614**33', amount: '$4.00', time: '2h ago', method: 'Telebirr', flag: '🇪🇹' },
    { id: 5, user: 'user905**12', amount: '$6.20', time: '3h ago', method: 'USDT (TON)', flag: '💎' },
    { id: 6, user: 'user341**77', amount: '$2.50', time: '4h ago', method: 'Airtel Money', flag: '🇰🇪' },
    { id: 7, user: 'user529**64', amount: '$4.50', time: '6h ago', method: 'Bank (IMPS)', flag: '🇮🇳' },
    { id: 8, user: 'user218**85', amount: '$3.25', time: '8h ago', method: 'GoPay', flag: '🇮🇩' },
    { id: 9, user: 'user834**19', amount: '$5.00', time: '11h ago', method: 'CBE Bank', flag: '🇪🇹' },
    { id: 10, user: 'user107**46', amount: '$4.80', time: '14h ago', method: 'USDT (TRC20)', flag: '💵' },
    { id: 11, user: 'user672**53', amount: '$3.50', time: '18h ago', method: 'GCash', flag: '🇵🇭' },
    { id: 12, user: 'user493**28', amount: '$4.00', time: 'yesterday', method: 'OPay', flag: '🇳🇬' },
    { id: 13, user: 'user315**88', amount: '$5.25', time: 'yesterday', method: 'TON Wallet', flag: '💎' },
    { id: 14, user: 'user720**14', amount: '$3.00', time: '2 days ago', method: 'Telebirr', flag: '🇪🇹' }
  ];

  const recentWithdrawals = data?.recentWithdrawals || fallbackWithdrawals;

  const topEarners = data?.topEarners || [
    { rank: 1, name: 'user94**12', refs: 28, earned: '$9.80', badge: '🥇' },
    { rank: 2, name: 'user78**35', refs: 21, earned: '$7.85', badge: '🥈' },
    { rank: 3, name: 'user51**80', refs: 17, earned: '$6.40', badge: '🥉' },
    { rank: 4, name: 'user33**49', refs: 14, earned: '$5.20', badge: '#4' },
    { rank: 5, name: 'user82**06', refs: 12, earned: '$4.65', badge: '#5' },
    { rank: 6, name: 'user19**67', refs: 11, earned: '$4.10', badge: '#6' },
    { rank: 7, name: 'user60**23', refs: 10, earned: '$3.75', badge: '#7' },
    { rank: 8, name: 'user45**91', refs: 10, earned: '$3.50', badge: '#8' },
    { rank: 9, name: 'user28**74', refs: 9, earned: '$3.15', badge: '#9' },
    { rank: 10, name: 'user11**59', refs: 8, earned: '$2.80', badge: '#10' }
  ];

  const platformStats = data?.platformStats || {
    totalPaidOut: '$386.50+',
    avgProcessingTime: '~2 Hours'
  };

  // Auto-Slider Timer (cycles smoothly every 3.5 seconds)
  useEffect(() => {
    if (!recentWithdrawals || recentWithdrawals.length === 0) return;
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % recentWithdrawals.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [recentWithdrawals.length]);

  const currentSliderItem = recentWithdrawals[sliderIndex] || recentWithdrawals[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={20} color="var(--accent-amber)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{t('leaderboard.title')}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Top network earners & live payouts this week</p>
          </div>
        </div>

        {/* Platform Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('leaderboard.totalPaid')}</span>
            <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{platformStats.totalPaidOut}</p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('leaderboard.avgTime')}</span>
            <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{platformStats.avgProcessingTime}</p>
          </div>
        </div>
      </div>

      {/* Tiny Live Auto-Slider Ticker */}
      {currentSliderItem && (
        <div
          onClick={() => setSliderIndex((prev) => (prev + 1) % recentWithdrawals.length)}
          style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.25)', fontSize: '12px', flexShrink: 0 }}>
              💸
            </span>
            <div style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                {currentSliderItem.user}
              </span>
              <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>
                withdrew <strong style={{ color: 'var(--accent-emerald)' }}>{currentSliderItem.amount}</strong> {currentSliderItem.time}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                ({currentSliderItem.method} {currentSliderItem.flag})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '6px' }}>
            <span style={{ fontSize: '9px', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 5px', borderRadius: '4px', fontWeight: '700' }}>
              LIVE
            </span>
          </div>
        </div>
      )}

      {/* Full Top Earners Leaderboard (Clean & In Descending Order) */}
      <div className="glass-card" style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} color="var(--accent-amber)" />
            This Week's Top Earners
          </h4>
          <span className="badge badge-amber" style={{ fontSize: '10px' }}>
            Rankings
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topEarners.map((earner) => (
            <div
              key={earner.rank}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                background: earner.rank <= 3 ? 'rgba(30, 41, 67, 0.45)' : 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-md)',
                border: earner.rank === 1
                  ? '1px solid rgba(245, 158, 11, 0.35)'
                  : earner.rank === 2
                  ? '1px solid rgba(148, 163, 184, 0.25)'
                  : earner.rank === 3
                  ? '1px solid rgba(217, 119, 6, 0.25)'
                  : '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: earner.rank <= 3 ? '18px' : '12px', fontWeight: '800', width: '24px', textAlign: 'center', color: earner.rank <= 3 ? undefined : 'var(--text-muted)' }}>
                  {earner.badge}
                </span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{earner.name}</p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{earner.refs} Referrals</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{earner.earned}</p>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Earned</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
