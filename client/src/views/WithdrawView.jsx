import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, Lock, CheckCircle2, Clock, AlertCircle, Building, Smartphone, Globe, RefreshCw } from 'lucide-react';
import { withdrawalApi } from '../services/api';

export default function WithdrawView({ user, onStatusChange }) {
  const [country, setCountry] = useState('ET'); // 'ET' (Ethiopia) or 'GLOBAL'
  const [ethMethod, setEthMethod] = useState('telebirr'); // 'telebirr' or 'cbe'
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [ethAccount, setEthAccount] = useState('');
  const [ethFullName, setEthFullName] = useState('');
  const [devBypass, setDevBypass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [liveStatus, setLiveStatus] = useState(user?.withdrawalStatus || 'none');

  // Fetch live withdrawal and gate status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await withdrawalApi.getStatus();
        if (res.success && res.data) {
          setLiveStatus(res.data.status);
        }
      } catch (err) {
        console.warn('Could not fetch live withdrawal status:', err.message);
      }
    }
    fetchStatus();
  }, []);

  const balance = user?.balance ?? 0.00;
  const adsWatched = user?.adsWatchedTotal ?? user?.adsWatchedToday ?? 0;
  const referralCount = user?.referralCount ?? 0;

  const isAdsEligible = adsWatched >= 20 || devBypass;
  const isRefEligible = referralCount >= 10 || devBypass;
  const isFullyEligible = isAdsEligible && isRefEligible;

  // Handle form submission (v1: status flag flip only, no address data sent to backend)
  const handleSubmitWithdrawal = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isFullyEligible) {
      setErrorMsg('Eligibility gate locked: Requires 20 ads watched and 10 referrals.');
      return;
    }

    setSubmitting(true);
    try {
      // Call backend (sends zero address payload)
      const res = await withdrawalApi.request({ devBypass });
      if (res.success) {
        setLiveStatus('pending');
        if (onStatusChange) {
          onStatusChange('pending');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit withdrawal request.');
    } finally {
      setSubmitting(false);
    }
  };

  // If user already has a pending/in_queue withdrawal, show the status queue card
  if (liveStatus === 'pending' || liveStatus === 'in_queue') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '24px 16px', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Clock size={28} color="var(--accent-amber)" />
          </div>
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>
            Status: In Queue / Pending Review
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px' }}>Withdrawal Requested</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
            Your withdrawal request has been placed in the review queue. Once processed by our administrator, funds will be released.
          </p>

          <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-md)', textAlign: 'left', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Amount:</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-emerald)' }}>${balance.toFixed(2)} USD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Queue Position:</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>#14 in line</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Security Gate:</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-emerald)' }}>Passed (20/20 Ads, 10/10 Refs)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={20} color="var(--accent-emerald)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Withdraw Earnings</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Available Balance: ${balance.toFixed(3)} USD</p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div style={{ padding: '10px 14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} color="var(--accent-rose)" />
          <span style={{ fontSize: '12px', color: 'var(--accent-rose)', fontWeight: '600' }}>{errorMsg}</span>
        </div>
      )}

      {/* Eligibility Gate Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isFullyEligible ? <ShieldCheck size={18} color="var(--accent-emerald)" /> : <Lock size={18} color="var(--accent-amber)" />}
            Eligibility Gate (20 Ads & 10 Referrals)
          </h4>
          <span className={`badge ${isFullyEligible ? 'badge-emerald' : 'badge-amber'}`}>
            {isFullyEligible ? 'Unlocked' : 'Locked'}
          </span>
        </div>

        {/* Ad watches progress */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>1. Watch 20 Total Ads</span>
            <span style={{ fontWeight: '700', color: isAdsEligible ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
              {adsWatched} / 20 {isAdsEligible && '✓'}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, (adsWatched / 20) * 100)}%`, background: isAdsEligible ? 'var(--gradient-emerald)' : 'var(--gradient-primary)' }} />
          </div>
        </div>

        {/* Referrals progress */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>2. Invite 10 Friends</span>
            <span style={{ fontWeight: '700', color: isRefEligible ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
              {referralCount} / 10 {isRefEligible && '✓'}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, (referralCount / 10) * 100)}%`, background: isRefEligible ? 'var(--gradient-emerald)' : 'var(--gradient-primary)' }} />
          </div>
        </div>

        {/* Dev Toggle Helper for testing */}
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dev Mode Gate Test</span>
          <button
            onClick={() => setDevBypass(!devBypass)}
            style={{ background: 'none', border: '1px dashed var(--accent-blue)', color: 'var(--accent-blue)', borderRadius: 'var(--radius-sm)', padding: '2px 6px', fontSize: '10px', cursor: 'pointer' }}
          >
            {devBypass ? 'Disable Bypass' : 'Force Unlock Gate (Test)'}
          </button>
        </div>
      </div>

      {/* Payment Form (UI-Only for v1) */}
      <div className="glass-card" style={{ opacity: isFullyEligible ? 1 : 0.6 }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>Payout Method & Details</h4>

        <form onSubmit={handleSubmitWithdrawal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Country Selector */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              Select Your Country
            </label>
            <select
              className="form-select"
              value={country}
              disabled={!isFullyEligible}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="ET">🇪🇹 Ethiopia (Telebirr / CBE)</option>
              <option value="GLOBAL">🌍 Global (USDT / Crypto Address)</option>
            </select>
          </div>

          {country === 'ET' ? (
            <>
              {/* Ethiopian Payment Method */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Payment Provider
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={!isFullyEligible}
                    onClick={() => setEthMethod('telebirr')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: ethMethod === 'telebirr' ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                      background: ethMethod === 'telebirr' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: ethMethod === 'telebirr' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Smartphone size={16} color="var(--accent-cyan)" /> Telebirr
                  </button>

                  <button
                    type="button"
                    disabled={!isFullyEligible}
                    onClick={() => setEthMethod('cbe')}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: ethMethod === 'cbe' ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                      background: ethMethod === 'cbe' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      color: ethMethod === 'cbe' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Building size={16} color="var(--accent-purple)" /> CBE Bank
                  </button>
                </div>
              </div>

              {/* Account / Phone Number */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  {ethMethod === 'telebirr' ? 'Telebirr Phone Number' : 'CBE Account Number'}
                </label>
                <input
                  type="text"
                  required
                  disabled={!isFullyEligible}
                  placeholder={ethMethod === 'telebirr' ? '09XXXXXXXX or 07XXXXXXXX' : '1000XXXXXXXXX'}
                  className="form-input"
                  value={ethAccount}
                  onChange={(e) => setEthAccount(e.target.value)}
                />
              </div>

              {/* Full Name */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                  Account Holder Full Name
                </label>
                <input
                  type="text"
                  required
                  disabled={!isFullyEligible}
                  placeholder="e.g. Abebe Bikila"
                  className="form-input"
                  value={ethFullName}
                  onChange={(e) => setEthFullName(e.target.value)}
                />
              </div>
            </>
          ) : (
            /* Global Crypto Address */
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                Crypto Payout Address (USDT - TON / TRC20)
              </label>
              <input
                type="text"
                required
                disabled={!isFullyEligible}
                placeholder="EQ... (TON) or T... (TRC20)"
                className="form-input"
                value={cryptoAddress}
                onChange={(e) => setCryptoAddress(e.target.value)}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFullyEligible || submitting}
            className="btn-primary"
            style={{ marginTop: '8px' }}
          >
            {submitting ? (
              <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <Wallet size={16} />
            )}
            {submitting ? 'Placing in Queue...' : `Request Withdrawal ($${balance.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
}
