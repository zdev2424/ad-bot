import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, Lock, CheckCircle2, Clock, AlertCircle, Building, Smartphone, Globe, X, Sparkles, HelpCircle } from 'lucide-react';
import { withdrawalApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function WithdrawView({ user, onStatusChange }) {
  const { t } = useLanguage();
  const [country, setCountry] = useState(''); // No country selected by default
  const [ethMethod, setEthMethod] = useState(''); // 'telebirr' or 'cbe'
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [ethAccount, setEthAccount] = useState('');
  const [ethFullName, setEthFullName] = useState('');
  const [devBypass, setDevBypass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [liveStatus, setLiveStatus] = useState(user?.withdrawalStatus || 'none');
  const [showQueueModal, setShowQueueModal] = useState(false);

  // Dynamic estimated wait time for the popup
  const estimatedWaitTime = '2 days (approx. 48 hours)';

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

  const handleSubmitWithdrawal = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!country) {
      setErrorMsg('Please select your country first.');
      return;
    }

    if (country === 'ET' && !ethMethod) {
      setErrorMsg('Please select your payment provider (Telebirr or CBE Bank).');
      return;
    }

    if (!isFullyEligible) {
      setErrorMsg('Eligibility gate locked: You must watch 20 ads and invite 10 friends (or toggle Dev Mode Test above).');
      return;
    }

    setSubmitting(true);
    try {
      // Call backend (v1: status flag only, zero address data sent)
      const res = await withdrawalApi.request({ devBypass });
      if (res.success) {
        setLiveStatus('pending');
        setShowQueueModal(true); // Open the Pending in Queue popup modal
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      {/* Header */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={20} color="var(--accent-emerald)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{t('withdraw.title')}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('withdraw.availableBalance')}: ${balance.toFixed(3)} USD</p>
          </div>
        </div>
      </div>

      {/* If already in queue, show the persistent status banner */}
      {(liveStatus === 'pending' || liveStatus === 'in_queue') && (
        <div className="glass-card" style={{ borderColor: 'rgba(245, 158, 11, 0.5)', background: 'linear-gradient(135deg, rgba(120, 53, 15, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="badge badge-amber">
              <Clock size={12} /> Status: Pending in Queue
            </span>
            <button
              onClick={() => setShowQueueModal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              View Queue Details
            </button>
          </div>
          <p style={{ fontSize: '13px', fontWeight: '600' }}>Your withdrawal request of ${balance.toFixed(2)} is being reviewed.</p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            ⏱️ Estimated wait time: <strong style={{ color: 'var(--accent-amber)' }}>{estimatedWaitTime}</strong>
          </p>
        </div>
      )}

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
            {t('withdraw.gateTitle')}
          </h4>
          <span className={`badge ${isFullyEligible ? 'badge-emerald' : 'badge-amber'}`}>
            {isFullyEligible ? 'Unlocked' : 'Locked'}
          </span>
        </div>

        {/* Ad watches progress */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('withdraw.step1')}</span>
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
            <span style={{ color: 'var(--text-secondary)' }}>{t('withdraw.step2')}</span>
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
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('withdraw.devBypass')}</span>
          <button
            type="button"
            onClick={() => {
              setDevBypass(!devBypass);
              setErrorMsg(null);
            }}
            style={{ background: 'none', border: '1px dashed var(--accent-blue)', color: 'var(--accent-cyan)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
          >
            {devBypass ? '✅ Test Bypass Active (Disable)' : '⚡ ' + t('withdraw.forceUnlock')}
          </button>
        </div>
      </div>

      {/* Payment Form (Always Interactive) */}
      <div className="glass-card">
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>{t('withdraw.payoutMethod')}</h4>

        <form onSubmit={handleSubmitWithdrawal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Country Selector */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {t('withdraw.selectCountry')} *
            </label>
            <select
              className="form-select"
              value={country}
              disabled={liveStatus === 'pending'}
              onChange={(e) => {
                setCountry(e.target.value);
                setEthMethod(''); // reset sub-provider on country change
                setErrorMsg(null);
              }}
            >
              <option value="">-- Choose Your Country --</option>
              <option value="ET">🇪🇹 Ethiopia</option>
              <option value="GLOBAL">🌍 Global / Other Countries</option>
            </select>
          </div>

          {/* Conditional Rendering: Ethiopia Options (Telebirr / CBE only appear if Ethiopia is selected) */}
          {country === 'ET' && (
            <>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  {t('withdraw.provider')} (Ethiopia) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={liveStatus === 'pending'}
                    onClick={() => {
                      setEthMethod('telebirr');
                      setErrorMsg(null);
                    }}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: ethMethod === 'telebirr' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      background: ethMethod === 'telebirr' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      color: ethMethod === 'telebirr' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Smartphone size={16} color="var(--accent-cyan)" /> Telebirr
                  </button>

                  <button
                    type="button"
                    disabled={liveStatus === 'pending'}
                    onClick={() => {
                      setEthMethod('cbe');
                      setErrorMsg(null);
                    }}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: ethMethod === 'cbe' ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                      background: ethMethod === 'cbe' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      color: ethMethod === 'cbe' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Building size={16} color="var(--accent-purple)" /> CBE Bank
                  </button>
                </div>
              </div>

              {ethMethod && (
                <>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                      {ethMethod === 'telebirr' ? 'Telebirr Phone Number' : 'CBE Account Number'} *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={liveStatus === 'pending'}
                      placeholder={ethMethod === 'telebirr' ? '09XXXXXXXX or 07XXXXXXXX' : '1000XXXXXXXXX'}
                      className="form-input"
                      value={ethAccount}
                      onChange={(e) => setEthAccount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                      {t('withdraw.fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={liveStatus === 'pending'}
                      placeholder="e.g. Abebe Bikila"
                      className="form-input"
                      value={ethFullName}
                      onChange={(e) => setEthFullName(e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Conditional Rendering: Global Crypto */}
          {country === 'GLOBAL' && (
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                {t('withdraw.cryptoAddress')} *
              </label>
              <input
                type="text"
                required
                disabled={liveStatus === 'pending'}
                placeholder="EQ... (TON) or T... (TRC20 USDT)"
                className="form-input"
                value={cryptoAddress}
                onChange={(e) => setCryptoAddress(e.target.value)}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!country || submitting || liveStatus === 'pending'}
            className="btn-primary"
            style={{
              marginTop: '8px',
              opacity: !isFullyEligible ? 0.7 : 1,
              background: !isFullyEligible ? 'rgba(255,255,255,0.1)' : 'var(--gradient-primary)'
            }}
          >
            {submitting ? (
              <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : !isFullyEligible ? (
              <Lock size={16} color="var(--accent-amber)" />
            ) : (
              <Wallet size={16} />
            )}
            {liveStatus === 'pending'
              ? 'Request in Queue'
              : submitting
              ? 'Placing in Queue...'
              : !isFullyEligible
              ? `Locked (${adsWatched}/20 Ads, ${referralCount}/10 Refs)`
              : `${t('withdraw.requestButton')} ($${balance.toFixed(2)})`}
          </button>
        </form>
      </div>

      {/* Pop-up Modal for "Pending in Queue" */}
      {showQueueModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              padding: '24px 20px',
              borderColor: 'rgba(245, 158, 11, 0.5)',
              background: 'linear-gradient(180deg, rgba(26, 35, 58, 0.98) 0%, rgba(15, 23, 42, 0.99) 100%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowQueueModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Clock size={30} color="var(--accent-amber)" />
            </div>

            <span className="badge badge-amber" style={{ marginBottom: '10px' }}>
              ⏳ Pending in Queue
            </span>

            <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>
              Withdrawal Placed in Queue!
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.5' }}>
              Your payout request has been successfully submitted and placed in our verification queue.
            </p>

            {/* Waiting Time Notice Box */}
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Processing Time:</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-amber)' }}>{estimatedWaitTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Queue Position:</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)' }}>#14 in line</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Requested Amount:</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-emerald)' }}>${balance.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={() => setShowQueueModal(false)}
              className="btn-primary"
              style={{ marginTop: '18px' }}
            >
              Got It / Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
