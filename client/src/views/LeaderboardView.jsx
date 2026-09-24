import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, DollarSign, CheckCircle2, Flame, Clock, RefreshCw } from 'lucide-react';
import { leaderboardApi } from '../services/api';

export default function LeaderboardView() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'top'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const activityFeed = data?.activityFeed || [
    { id: 1, user: 'User ***849', method: 'Telebirr (Ethiopia)', amount: '$5.00', time: '2 mins ago', status: 'Completed' },
    { id: 2, user: 'User ***123', method: 'USDT (TON Network)', amount: '$8.50', time: '14 mins ago', status: 'Completed' },
    { id: 3, user: 'User ***902', method: 'CBE Bank (Ethiopia)', amount: '$10.00', time: '45 mins ago', status: 'Completed' },
    { id: 4, user: 'User ***441', method: 'USDT (TON Network)', amount: '$4.25', time: '1 hour ago', status: 'Completed' }
  ];

  const topEarners = data?.topEarners || [
    { rank: 1, name: 'Kidus_Eth', refs: 142, earned: '$48.20', badge: '🥇' },
    { rank: 2, name: 'CryptoHunter', refs: 98, earned: '$36.50', badge: '🥈' },
    { rank: 3, name: 'Yared_Tg', refs: 84, earned: '$29.80', badge: '🥉' }
  ];

  const platformStats = data?.platformStats || {
    totalPaidOut: '$1,420.50+',
    avgProcessingTime: '< 2 Hours'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={20} color="var(--accent-amber)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Live Activity & Rankings</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time platform payouts and leaderboards</p>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Paid Out</span>
            <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{platformStats.totalPaidOut}</p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg. Queue Time</span>
            <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{platformStats.avgProcessingTime}</p>
          </div>
        </div>
      </div>

      {/* Segment Switcher */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('feed')}
          className="btn-secondary"
          style={{
            background: activeTab === 'feed' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.06)',
            color: activeTab === 'feed' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            fontSize: '13px'
          }}
        >
          <Clock size={16} /> Recent Withdrawals
        </button>

        <button
          onClick={() => setActiveTab('top')}
          className="btn-secondary"
          style={{
            background: activeTab === 'top' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.06)',
            color: activeTab === 'top' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            fontSize: '13px'
          }}
        >
          <Flame size={16} /> Top Earners
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' ? (
        <div className="glass-card" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
            Live Withdrawal Activity Stream
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activityFeed.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700' }}>{item.user}</p>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• {item.time}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.method}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{item.amount}</p>
                  <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                    <CheckCircle2 size={10} /> {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '14px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>This Week's Top Referrers</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topEarners.map((earner) => (
              <div
                key={earner.rank}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', width: '24px', textAlign: 'center' }}>
                    {earner.badge}
                  </span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700' }}>{earner.name}</p>
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
      )}
    </div>
  );
}
