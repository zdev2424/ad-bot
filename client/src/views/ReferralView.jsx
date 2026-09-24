import React, { useState } from 'react';
import { Users, Copy, Check, Share2, Gift, Sparkles, UserPlus } from 'lucide-react';

export default function ReferralView({ user }) {
  const [copied, setCopied] = useState(false);

  const telegramId = user?.telegramId || '999999999';
  const botUsername = 'EarnCashIOBot';
  const refLink = `https://t.me/${botUsername}?start=ref_${telegramId}`;
  const referralCount = user?.referralCount ?? 0;
  const referralBonusEarned = (referralCount * 0.05).toFixed(2);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareText = encodeURIComponent('🚀 Join EarnCashIO and earn real cash by watching short video ads! Fast payouts & zero KYC:');
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${shareText}`;
    window.open(shareUrl, '_blank');
  };

  // Mock list of invited friends for initial shell
  const sampleInvitedFriends = [
    { id: 1, name: 'Alex M.', username: '@alex_m', date: 'Yesterday', bonus: '+$0.05' },
    { id: 2, name: 'Dawit T.', username: '@dawitt', date: '2 days ago', bonus: '+$0.05' },
    { id: 3, name: 'Elena R.', username: '@elena_r', date: '3 days ago', bonus: '+$0.05' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Referral Header Card */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gift size={20} color="var(--accent-purple)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Invite & Earn</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Get $0.05 for every friend you invite</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Invited Friends</span>
            <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{referralCount}</p>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Ref Earnings</span>
            <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-emerald)' }}>${referralBonusEarned}</p>
          </div>
        </div>
      </div>

      {/* Referral Link & Actions */}
      <div className="glass-card">
        <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
          Your Unique Referral Link
        </label>

        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '4px 6px 4px 12px', marginBottom: '12px' }}>
          <input
            type="text"
            readOnly
            value={refLink}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '12px', outline: 'none', fontFamily: 'monospace' }}
          />
          <button
            onClick={handleCopy}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
          >
            {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <button className="btn-primary" onClick={handleShare} style={{ background: 'var(--gradient-purple)' }}>
          <Share2 size={16} />
          Share to Telegram Contacts
        </button>
      </div>

      {/* How it Works Guide */}
      <div className="glass-card">
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>How the Referral Program Works</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>1</span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Share your personal invite link with friends, Telegram groups, or social media.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>2</span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>When your friend opens the bot and launches the Mini App, you instantly receive +$0.05 commission.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>3</span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Refer at least 10 friends to unlock the withdrawal eligibility gate!</p>
          </div>
        </div>
      </div>

      {/* Invited Friends List */}
      <div className="glass-card">
        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Invited Friends ({referralCount > 0 ? referralCount : '0'})</h4>
        {referralCount === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <UserPlus size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No friends invited yet.</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Share your link above to start earning!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sampleInvitedFriends.map((friend) => (
              <div key={friend.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600' }}>{friend.name}</p>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{friend.username} • {friend.date}</span>
                </div>
                <span className="badge badge-emerald">{friend.bonus}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
