import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, X, Sparkles, BookOpen, UserCheck, Flame, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsModal({ isOpen, onClose, isFirstTime = false }) {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('rules'); // 'rules' | 'terms' | 'privacy'

  if (!isOpen) return null;

  const handleAccept = () => {
    localStorage.setItem('earncashio_terms_accepted_v1', 'true');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 1000,
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 18px',
          background: 'linear-gradient(180deg, rgba(22, 30, 49, 0.98) 0%, rgba(10, 14, 23, 0.99) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          position: 'relative'
        }}
      >
        {/* Close button (only visible if not mandatory first-time) */}
        {!isFirstTime && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}

        {/* Header Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: isFirstTime
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)'
                : 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
          >
            {isFirstTime ? <Sparkles size={26} color="var(--accent-cyan)" /> : <Scale size={26} color="var(--accent-emerald)" />}
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            {isFirstTime ? 'Welcome to EarnCashIO!' : 'Terms & Fair Play Rules'}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isFirstTime ? 'Please review our rules before you start earning.' : 'Official Community Guidelines & Policies'}
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {[
            { id: 'rules', label: '⚡ Rules' },
            { id: 'terms', label: '📜 Terms' },
            { id: 'privacy', label: '🔒 Privacy' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: '7px 4px',
                borderRadius: 'var(--radius-sm)',
                border: activeSection === tab.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: activeSection === tab.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                color: activeSection === tab.id ? '#fff' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            overflowY: 'auto',
            maxHeight: '260px',
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '12px',
            lineHeight: '1.5',
            color: 'var(--text-secondary)'
          }}
        >
          {activeSection === 'rules' && (
            <>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '4px' }}>
                  1. How to Earn
                </strong>
                <p>• Watch rewarded video ads (up to 100 slots daily) to earn USD balances directly to your account.</p>
                <p>• Earn <strong>+$0.05</strong> commission for every genuine friend who joins via your invite link.</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent-amber)', display: 'block', marginBottom: '4px' }}>
                  2. Strict Anti-Fraud & Fair Play
                </strong>
                <p>• <strong>Strictly 1 account</strong> per human user and Telegram ID.</p>
                <p>• The use of emulators, auto-clickers, bots, or fake referral scripts is detected by FraudGuard and results in an immediate permanent ban and total balance forfeiture.</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent-emerald)', display: 'block', marginBottom: '4px' }}>
                  3. Withdrawal Gate & Payouts
                </strong>
                <p>• Payout unlocks once you reach <strong>20 ad watches</strong> and <strong>10 friend invites</strong>.</p>
                <p>• Withdrawal requests are placed in an automated queue (est. 48h) to protect the reward pool against fraud.</p>
              </div>
            </>
          )}

          {activeSection === 'terms' && (
            <>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
                  Service Agreement
                </strong>
                <p>By accessing EarnCashIO via Telegram, you confirm you are at least 18 years old (or legal age in your jurisdiction) and agree to abide by these Terms.</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
                  Reward Disclaimer
                </strong>
                <p>EarnCashIO distributes rewards generated from verified advertising partner impressions. Rewards are not guaranteed in cases where third-party ad networks flag unverified or suspicious impressions.</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
                  Account Termination
                </strong>
                <p>We reserve the right to suspend or terminate accounts that violate our fair play guidelines, manipulate ad delivery, or engage in abusive referral conduct.</p>
              </div>
            </>
          )}

          {activeSection === 'privacy' && (
            <>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent-emerald)', display: 'block', marginBottom: '4px' }}>
                  Data Protection
                </strong>
                <p>We only use your public Telegram User ID and first name to authenticate your account and attribute your referral earnings.</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent-emerald)', display: 'block', marginBottom: '4px' }}>
                  No Financial Credentials Stored
                </strong>
                <p>We never collect or store banking PINs, private keys, passwords, or credit card information. Payouts are made directly to your requested public address or mobile money ID.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer Action Button */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          {isFirstTime ? (
            <button
              type="button"
              onClick={handleAccept}
              className="btn-primary"
              style={{ width: '100%', fontSize: '14px', fontWeight: '700' }}
            >
              <CheckCircle2 size={18} /> I Agree & Start Earning 🚀
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="btn-primary"
              style={{ width: '100%', fontSize: '13px' }}
            >
              Close / Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
