import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Tv, DollarSign, Check, X, Clock, RefreshCw, AlertTriangle, CheckCircle2, Radio, Plus, Trash2, Globe } from 'lucide-react';
import { adminApi } from '../services/api';
import { triggerHaptic } from '../utils/haptics';

export default function AdminView({ user }) {
  const [overview, setOverview] = useState(null);
  const [queue, setQueue] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  // New Channel Form State
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelUsername, setNewChannelUsername] = useState('');
  const [newChannelType, setNewChannelType] = useState('sponsor'); // 'official' | 'sponsor'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, queueRes, channelsRes] = await Promise.all([
        adminApi.getOverview().catch(() => null),
        adminApi.getWithdrawals().catch(() => null),
        adminApi.getChannels().catch(() => null)
      ]);

      if (overviewRes?.success && overviewRes?.data) {
        setOverview(overviewRes.data);
      }
      if (queueRes?.success && queueRes?.data) {
        setQueue(queueRes.data);
      }
      if (channelsRes?.success && channelsRes?.data) {
        setChannels(channelsRes.data);
      }
    } catch (err) {
      console.warn('Admin fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (id, action) => {
    triggerHaptic('medium');
    setActionLoading(id);
    setNotification(null);
    try {
      const res = await adminApi.updateWithdrawal(id, action);
      if (res.success) {
        triggerHaptic('success');
        setQueue((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: action } : item))
        );
        setNotification({
          type: 'success',
          text: `Withdrawal #${id} marked as ${action} successfully.`
        });
      }
    } catch (err) {
      triggerHaptic('error');
      setNotification({
        type: 'error',
        text: err.message || `Failed to update withdrawal #${id}`
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName || !newChannelUsername) return;

    triggerHaptic('medium');
    try {
      const res = await adminApi.addChannel({
        name: newChannelName,
        username: newChannelUsername,
        type: newChannelType,
        is_active: 1
      });

      if (res.success && res.data) {
        triggerHaptic('success');
        setChannels((prev) => [...prev, res.data]);
        setNewChannelName('');
        setNewChannelUsername('');
        setShowAddChannel(false);
        setNotification({
          type: 'success',
          text: `Added channel "${res.data.name}" to withdrawal requirements!`
        });
      }
    } catch (err) {
      triggerHaptic('error');
      setNotification({
        type: 'error',
        text: err.message || 'Failed to add channel'
      });
    }
  };

  const handleDeleteChannel = async (id, name) => {
    triggerHaptic('warning');
    try {
      const res = await adminApi.deleteChannel(id);
      if (res.success) {
        triggerHaptic('success');
        setChannels((prev) => prev.filter((c) => c.id !== id));
        setNotification({
          type: 'success',
          text: `Removed channel "${name}" from requirements.`
        });
      }
    } catch (err) {
      triggerHaptic('error');
      setNotification({
        type: 'error',
        text: err.message || 'Failed to remove channel'
      });
    }
  };

  const handleToggleChannel = async (id, currentActive) => {
    triggerHaptic('light');
    const newActive = !currentActive;
    try {
      const res = await adminApi.toggleChannel(id, newActive);
      if (res.success) {
        setChannels((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_active: newActive ? 1 : 0 } : c))
        );
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.message || 'Failed to toggle channel status'
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Admin Header */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* Telegram Channel & Sponsor Management (Engine 3) */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={16} color="var(--accent-cyan)" />
              Telegram & Sponsor Channels
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Mandatory channels users must join to unlock withdrawals
            </p>
          </div>
          <button
            onClick={() => setShowAddChannel(!showAddChannel)}
            style={{
              background: showAddChannel ? 'rgba(244, 63, 94, 0.15)' : 'rgba(37, 99, 235, 0.2)',
              border: showAddChannel ? '1px solid var(--accent-rose)' : '1px solid var(--accent-blue)',
              color: showAddChannel ? 'var(--accent-rose)' : 'var(--accent-cyan)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {showAddChannel ? <X size={12} /> : <Plus size={12} />}
            {showAddChannel ? 'Cancel' : 'Add Channel'}
          </button>
        </div>

        {/* Add Channel Inline Form */}
        {showAddChannel && (
          <form onSubmit={handleAddChannel} style={{ padding: '12px', background: 'rgba(10, 15, 26, 0.85)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
              ➕ Add Telegram Channel or Paid Sponsor
            </span>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Channel / Sponsor Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EarnCashIO VIP Announcements"
                className="form-input"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                style={{ minHeight: '38px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Telegram Username or Link *
              </label>
              <input
                type="text"
                required
                placeholder="@EarnCashIO_Official or t.me/EarnCashIO_Official"
                className="form-input"
                value={newChannelUsername}
                onChange={(e) => setNewChannelUsername(e.target.value)}
                style={{ minHeight: '38px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Channel Type:
                </label>
                <select
                  className="form-select"
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value)}
                  style={{ minHeight: '38px', fontSize: '12px' }}
                >
                  <option value="official">Official Channel</option>
                  <option value="sponsor">Paid Sponsor ($)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ minHeight: '38px', padding: '8px', fontSize: '12px' }}
                >
                  Save Channel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Channels List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {channels.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
              No channels configured. Tap "Add Channel" above.
            </p>
          ) : (
            channels.map((ch) => (
              <div
                key={ch.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  border: ch.is_active ? '1px solid var(--border-color)' : '1px solid rgba(244, 63, 94, 0.3)',
                  opacity: ch.is_active ? 1 : 0.6
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {ch.name}
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 5px', borderRadius: '3px', background: ch.type === 'sponsor' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: ch.type === 'sponsor' ? 'var(--accent-amber)' : 'var(--accent-cyan)' }}>
                      {ch.type === 'sponsor' ? 'SPONSOR' : 'OFFICIAL'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ch.username}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleToggleChannel(ch.id, Boolean(ch.is_active))}
                    style={{
                      padding: '5px 8px',
                      background: ch.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                      border: ch.is_active ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                      color: ch.is_active ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {ch.is_active ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => handleDeleteChannel(ch.id, ch.name)}
                    style={{
                      padding: '5px 8px',
                      background: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: 'var(--accent-rose)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

