import React, { useState, useEffect } from 'react';
import { Tv, CheckCircle, Clock, PlayCircle, Sparkles, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { adsgramService } from '../services/adsgram';
import { tasksApi } from '../services/api';

export default function TasksView({ user, onAdCompleted }) {
  const [watchingSlot, setWatchingSlot] = useState(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [notification, setNotification] = useState(null);
  const [completedSlots, setCompletedSlots] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const totalSlots = 100;

  // Initialize Adsgram SDK & load live task status from backend
  useEffect(() => {
    adsgramService.init();

    async function fetchTaskStatus() {
      try {
        const res = await tasksApi.getStatus();
        if (res.success && res.data) {
          setCompletedSlots(res.data.completedSlots || []);
          if (res.data.remainingCooldown > 0) {
            setCooldownTime(res.data.remainingCooldown);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live task status:', err.message);
      } finally {
        setLoadingStatus(false);
      }
    }

    fetchTaskStatus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownTime <= 0) return;

    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Execute Ad Watch Flow
  const handleWatchAd = async (slotNum) => {
    if (cooldownTime > 0) {
      setNotification({ type: 'warning', text: `Please wait ${cooldownTime}s before watching the next ad.` });
      return;
    }

    if (completedSlots.includes(slotNum)) {
      setNotification({ type: 'info', text: `Slot #${slotNum} already completed today! Resets at 00:00 UTC.` });
      return;
    }

    setWatchingSlot(slotNum);
    setNotification(null);

    try {
      // 1. Play Rewarded Ad through Adsgram SDK
      await adsgramService.showRewardedAd();

      // 2. Call Backend API to verify and credit balance
      const result = await tasksApi.complete(slotNum);

      if (result.success) {
        setCompletedSlots((prev) => [...prev, slotNum]);
        setCooldownTime(result.cooldownSeconds || 15);
        setNotification({
          type: 'success',
          text: `🎉 Slot #${slotNum} completed! +$${result.reward.toFixed(3)} credited.`
        });

        if (onAdCompleted) {
          onAdCompleted(slotNum, result.user);
        }
      }
    } catch (error) {
      console.error('Ad Watch error:', error);
      setNotification({
        type: 'error',
        text: error.message || 'Ad playback could not be verified. Please try again.'
      });
    } finally {
      setWatchingSlot(null);
    }
  };

  const watchedCount = completedSlots.length;
  const nextTargetSlot = completedSlots.length + 1;
  const progressPercent = Math.min(100, Math.round((watchedCount / totalSlots) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tv size={18} color="var(--accent-blue)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>100 Ad Slots Grid</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>5 Columns × 20 Rows</p>
            </div>
          </div>
          <span className="badge badge-emerald">+$0.005 / Slot</span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '10px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Daily Progress</span>
            <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
              {watchedCount} / {totalSlots} ({progressPercent}%)
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Cooldown Alert */}
        {cooldownTime > 0 && (
          <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Clock size={16} color="var(--accent-amber)" />
            <span style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: '600' }}>
              Next slot unlocks in {cooldownTime}s...
            </span>
          </div>
        )}

        {/* Notification Alert */}
        {notification && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : notification.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : notification.type === 'error' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} color={notification.type === 'success' ? 'var(--accent-emerald)' : notification.type === 'error' ? 'var(--accent-rose)' : 'var(--accent-blue)'} />
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>{notification.text}</span>
          </div>
        )}
      </div>

      {/* Grid Status Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.3)', border: '1px solid var(--accent-emerald)' }} />
          <span>Watched</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--gradient-primary)' }} />
          <span>Next Ready</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }} />
          <span>Locked</span>
        </div>
      </div>

      {/* 5-Column x 20-Row Grid (100 Slots) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          padding: '4px 0'
        }}
      >
        {Array.from({ length: totalSlots }, (_, i) => {
          const slotNumber = i + 1;
          const isWatched = completedSlots.includes(slotNumber);
          const isCurrentTarget = slotNumber === nextTargetSlot;
          const isWatching = watchingSlot === slotNumber;
          const isFutureLocked = slotNumber > nextTargetSlot;

          let cardBg = 'rgba(18, 24, 38, 0.7)';
          let borderColor = 'var(--border-color)';
          let textColor = 'var(--text-muted)';
          let shadow = 'none';

          if (isWatched) {
            cardBg = 'rgba(16, 185, 129, 0.12)';
            borderColor = 'rgba(16, 185, 129, 0.35)';
            textColor = 'var(--accent-emerald)';
          } else if (isCurrentTarget) {
            cardBg = 'linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(14, 116, 144, 0.7) 100%)';
            borderColor = 'var(--accent-cyan)';
            textColor = '#ffffff';
            shadow = '0 0 12px rgba(6, 182, 212, 0.35)';
          }

          return (
            <button
              key={slotNumber}
              disabled={isWatched || isWatching || cooldownTime > 0}
              onClick={() => handleWatchAd(slotNumber)}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                background: cardBg,
                border: `1px solid ${borderColor}`,
                boxShadow: shadow,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '4px',
                cursor: isWatched ? 'default' : isCurrentTarget ? 'pointer' : 'pointer',
                opacity: isFutureLocked ? 0.7 : 1,
                position: 'relative',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              {isWatching ? (
                <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : isWatched ? (
                <>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-emerald)' }}>#{slotNumber}</span>
                  <CheckCircle size={14} color="var(--accent-emerald)" />
                </>
              ) : isCurrentTarget ? (
                <>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#fff' }}>#{slotNumber}</span>
                  <PlayCircle size={14} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--accent-cyan)' }}>WATCH</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>#{slotNumber}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>+$0.005</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
