import React, { useState } from 'react';
import { ShieldAlert, Users, Tv, DollarSign, Check, X, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AdminView({ user }) {
  const [queue, setQueue] = useState([
    { id: 101, telegramId: '98412499', username: '@alex_m', adsWatched: 24, refs: 12, amount: '$5.00', status: 'pending', requestedAt: '10 mins ago' },
    { id: 102, telegramId: '66184920', username: '@dawit_k', adsWatched: 32, refs: 15, amount: '$7.50', status: 'pending', requestedAt: '25 mins ago' },
    { id: 103, telegramId: '77291044', username: '@crypto_botter', adsWatched: 20, refs: 10, amount: '$4.20', status: 'pending', requestedAt: '1 hour ago' }
  ]);

  const handleAction = (id, newStatus) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Admin Header */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={20} color="var(--accent-rose)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Admin Control Center</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Administrator: {user?.firstName} ({user?.telegramId})</p>
            </div>
          </div>
          <span className="badge badge-rose">Admin Mode</span>
        </div>
      </div>

      {/* Platform KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Users size={14} /> Total Users
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>1,842</p>
          <span style={{ fontSize: '10px', color: 'var(--accent-emerald)' }}>+124 today</span>
        </div>

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Tv size={14} /> Ads Served
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>14,290</p>
          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>eCPM: ~$3.20</span>
        </div>

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <DollarSign size={14} /> Gross Revenue
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px', color: 'var(--accent-emerald)' }}>$45.72</p>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Estimated Adsgram</span>
        </div>

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Clock size={14} /> In Queue
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px', color: 'var(--accent-amber)' }}>{queue.filter(q => q.status === 'pending').length}</p>
          <span style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>Pending Review</span>
        </div>
      </div>

      {/* Withdrawal Queue Management */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Withdrawal Review Queue</h4>
          <span className="badge badge-amber">{queue.length} Total</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {queue.map((req) => (
            <div
              key={req.id}
              style={{
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700' }}>{req.username} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>({req.telegramId})</span></p>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {req.adsWatched} Ads Watched • {req.refs} Referrals
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-emerald)' }}>{req.amount}</p>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{req.requestedAt}</span>
                </div>
              </div>

              {/* Status or Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                <span className={`badge ${req.status === 'approved' ? 'badge-emerald' : req.status === 'rejected' ? 'badge-rose' : 'badge-amber'}`}>
                  {req.status}
                </span>

                {req.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleAction(req.id, 'approved')}
                      style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'rejected')}
                      style={{ padding: '4px 10px', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <X size={12} /> Reject
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Action Recorded</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
