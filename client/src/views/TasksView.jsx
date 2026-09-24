import React, { useState } from 'react';
import { Tv, CheckCircle, Clock, PlayCircle, Sparkles, AlertCircle } from 'lucide-react';

export default function TasksView({ user, onAdCompleted }) {
  const [selectedRange, setSelectedRange] = useState(0); // 0: 1-25, 1: 26-50, 2: 51-75, 3: 76-100
  const [watchingSlot, setWatchingSlot] = useState(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [notification, setNotification] = useState(null);

  const rangeSize = 25;
  const totalSlots = 100;
  const ranges = [
    { label: 'Slots 1–25', start: 1, end: 25 },
    { label: 'Slots 26–50', start: 26, end: 50 },
    { label: 'Slots 51–75', start: 51, end: 75 },
    { label: 'Slots 76–100', start: 76, end: 100 }
  ];

  const currentRange = ranges[selectedRange];
  const watchedCount = user?.adsWatchedToday ?? 0;

  // Simulate watching an ad (Module 5 will hook directly to Adsgram SDK)
  const handleWatchAd = (slotNum) => {
    if (cooldownTime > 0) {
      setNotification({ type: 'warning', text: `Please wait ${cooldownTime}s before watching the next ad.` });
      return;
    }

    if (slotNum <= watchedCount) {
      setNotification({ type: 'info', text: `Slot #${slotNum} already completed today! Resets at 00:00 UTC.` });
      return;
    }

    setWatchingSlot(slotNum);
    setNotification(null);

    // Simulate 3 second ad playback flow for UI testing
    setTimeout(() => {
      setWatchingSlot(null);
      setCooldownTime(15);
      setNotification({ type: 'success', text: `🎉 Ad #${slotNum} watched! Earned +$0.005 USD.` });

      if (onAdCompleted) {
        onAdCompleted(slotNum);
      }

      // Countdown cooldown timer
      const interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tv size={16} color="var(--accent-blue)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Rewarded Ad Slots</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Watch short 15s videos to earn cash</p>
            </div>
          </div>
          <span className="badge badge-emerald">+$0.005 / Ad</span>
        </div>

        {/* Cooldown Alert */}
        {cooldownTime > 0 && (
          <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Clock size={16} color="var(--accent-amber)" />
            <span style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: '600' }}>
              Next ad unlocks in {cooldownTime} seconds...
            </span>
          </div>
        )}

        {/* Notification Alert */}
        {notification && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} color={notification.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-blue)'} />
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>{notification.text}</span>
          </div>
        )}
      </div>

      {/* Range Segment Controller */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        {ranges.map((range, index) => (
          <button
            key={range.label}
            onClick={() => setSelectedRange(index)}
            style={{
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: selectedRange === index ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
              background: selectedRange === index ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.5)',
              color: selectedRange === index ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {range.start}–{range.end}
          </button>
        ))}
      </div>

      {/* Ad Slots Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: rangeSize }, (_, i) => {
          const slotNumber = currentRange.start + i;
          const isWatched = slotNumber <= watchedCount;
          const isCurrentTarget = slotNumber === watchedCount + 1;
          const isWatching = watchingSlot === slotNumber;

          return (
            <div
              key={slotNumber}
              className="glass-card"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: isWatched ? 0.6 : 1,
                borderColor: isCurrentTarget ? 'rgba(59, 130, 246, 0.5)' : 'var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: isWatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '13px',
                  color: isWatched ? 'var(--accent-emerald)' : 'var(--accent-blue)'
                }}>
                  #{slotNumber}
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700' }}>Ad Slot #{slotNumber}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reward: +$0.005 USD</span>
                </div>
              </div>

              {isWatched ? (
                <span className="badge badge-emerald">
                  <CheckCircle size={12} /> Watched
                </span>
              ) : isWatching ? (
                <button
                  disabled
                  className="btn-primary"
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '12px' }}
                >
                  <div style={{ width: '12px', height: '12px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Watching...
                </button>
              ) : (
                <button
                  onClick={() => handleWatchAd(slotNumber)}
                  disabled={cooldownTime > 0}
                  className="btn-secondary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '12px',
                    background: isCurrentTarget ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.08)',
                    color: isCurrentTarget ? '#ffffff' : 'var(--text-primary)',
                    border: 'none'
                  }}
                >
                  <PlayCircle size={14} /> Watch
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
