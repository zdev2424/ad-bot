import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Tv, DollarSign, Check, X, Clock, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../services/api';

export default function AdminView({ user }) {
  const [overview, setOverview] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, queueRes] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getWithdrawals()
      ]);

      if (overviewRes.success && overviewRes.data) {
        setOverview(overviewRes.data);
      }
      if (queueRes.success && queueRes.data) {
        setQueue(queueRes.data);
      }
    } catch (err) {
      console.warn('Admin fetch warning:', err.message);
      // Fallback seed data for dev view
      setOverview({
        totalUsers: 1,
        totalAdsServed: 4,
        totalReferrals: 0,
        pendingWithdrawalsCount: 1,
        estimatedGrossRevenue: 0.15,
        totalPaidOut: 0.00,
        systemStatus: 'Operational',
        adNetwork: 'Adsgram (Connected)'
      });
      setQueue([
        { id: 101, telegramId: '98412499', username: '@alex_m', adsWatched: 24, refs: 12, amount: '$5.00', status: 'pending', requestedAt: '10 mins ago' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (id, newStatus) => {
    setActionLoading(id);
    setNotification(null);
    try {
      const res = await adminApi.updateWithdrawal(id, newStatus);
      if (res.success) {
        setQueue((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        setNotification({
          type: 'success',
          text: `Withdrawal #${id} marked as ${newStatus} successfully.`
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.message || `Failed to update withdrawal #${id}`
      });
    } finally {
      setActionLoading(null);
    }
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
          <button
            onClick={fetchAdminData}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Sync
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={16} color="var(--accent-emerald)" /> : <AlertTriangle size={16} color="var(--accent-rose)" />}
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>{notification.text}</span>
        </div>
      )}

      {/* Platform KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Users size={14} /> Total Users
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{overview?.totalUsers ?? 1}</p>
          <span style={{ fontSize: '10px', color: 'var(--accent-emerald)' }}>Live in Database</span>
        </div>

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Tv size={14} /> Ads Served
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>{overview?.totalAdsServed ?? 0}</p>
          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>Adsgram Rewarded</span>
        </div>

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <DollarSign size={14} /> Gross Revenue
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px', color: 'var(--accent-emerald)' }}>
            ${overview?.estimatedGrossRevenue?.toFixed(2) ?? '0.00'}
          </p>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>eCPM (~$3.50)</span>
        </div>

        <div className="glass-card" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Clock size={14} /> In Queue
          </div>
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px', color: 'var(--accent-amber)' }}>
            {queue.filter(q => q.status === 'pending').length}
          </p>
          <span style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>Pending Review</span>
        </div>
      </div>

      {/* Withdrawal Queue Management */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Withdrawal Review Queue</h4>
          <span className="badge badge-amber">{queue.length} Requests</span>
        </div>

        {queue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No withdrawal requests currently in queue.</p>
          </div>
        ) : (
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
                    <p style={{ fontSize: '14px', fontWeight: '700' }}>
                      {req.username} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>({req.telegramId})</span>
                    </p>
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
                        disabled={actionLoading === req.id}
                        style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'rejected')}
                        disabled={actionLoading === req.id}
                        style={{ padding: '6px 12px', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
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
        )}
      </div>
    </div>
  );
}
