import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, Share2, Gift, Sparkles, UserPlus, RefreshCw, ArrowRight } from 'lucide-react';
import { referralApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

export default function ReferralView({ user }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const telegramId = user?.telegramId || '999999999';
  const botUsername = 'EarnCashIOBot';
  const defaultRefLink = `https://t.me/${botUsername}?start=ref_${telegramId}`;

  useEffect(() => {
    async function fetchReferralSummary() {
      try {
        const res = await referralApi.getSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.warn('Could not load live referral summary:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReferralSummary();
  }, []);

  const refLink = summary?.referralLink || defaultRefLink;
  const referralCount = summary?.referralCount ?? user?.referralCount ?? 0;
  const referralBonusEarned = (referralCount * 0.05).toFixed(2);
  const invitedFriends = summary?.invitedFriends || [];

  const handleCopy = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShare = () => {
    triggerHaptic('medium');
    const shareText = encodeURIComponent('🚀 Join EarnCashIO and earn real cash by watching short video ads! Fast payouts & zero KYC:');
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${shareText}`;
    
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Referral Header Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gift size={20} color="var(--accent-blue)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{t('refer.title')}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('refer.subtitle')}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: 'rgba(10, 15, 26, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('refer.invitedFriends')}</span>
            <p className="tabular-nums" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>{referralCount}</p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('refer.refEarnings')}</span>
            <p className="tabular-nums" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>${referralBonusEarned}</p>
          </div>
        </div>
      </div>

      {/* Referral Link & Actions with Thumb Reach */}
      <div className="glass-card">
        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
          {t('refer.uniqueLink')}
        </label>

        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(10, 15, 26, 0.85)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '6px 8px 6px 12px', marginBottom: '12px' }}>
          <input
            type="text"
            readOnly
            value={refLink}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#60a5fa', fontSize: '12px', outline: 'none', fontFamily: 'monospace' }}
          />
          <button
            onClick={handleCopy}
            className="btn-secondary"
            style={{ padding: '8px 12px', minHeight: '36px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
          >
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copied ? t('refer.copied') : t('refer.copy')}
          </button>
        </div>

        {/* Big Ergonomic Telegram Share Button */}
        <button
          onClick={handleShare}
          className="btn-primary"
        >
          <Share2 size={18} />
          {t('refer.shareTelegram')}
        </button>
      </div>

      {/* How It Works Explainer */}
      <div className="glass-card">
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>{t('refer.howItWorks')}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>1.</span>
            <span>{t('refer.step1')}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: 'var(--accent-purple)', fontWeight: '800' }}>2.</span>
            <span>{t('refer.step2')}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: '800' }}>3.</span>
            <span>{t('refer.step3')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
