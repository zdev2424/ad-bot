import React, { useState, useEffect } from 'react';
import { Tv, CheckCircle, Clock, PlayCircle, Sparkles, AlertCircle, RefreshCw, Zap, Play } from 'lucide-react';
import { adsgramService } from '../services/adsgram';
import { tasksApi } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { triggerHaptic } from '../utils/haptics';

export default function TasksView({ user, onAdCompleted }) {
  const { t } = useLanguage();
  const [watchingSlot, setWatchingSlot] = useState(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [notification, setNotification] = useState(null);
  const [completedSlots, setCompletedSlots] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const totalSlots = 100;

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

  useEffect(() => {
    if (cooldownTime <= 0) return;

    const timer = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerHaptic('light');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleWatchAd = async (slotNum) => {
    if (cooldownTime > 0) {
      triggerHaptic('warning');
      setNotification({ type: 'warning', text: t('tasks.nextUnlock', { time: cooldownTime }) });
      return;
    }

    if (completedSlots.includes(slotNum)) {
      triggerHaptic('light');
      setNotification({ type: 'info', text: `Slot #${slotNum} already completed today!` });
      return;
    }

    triggerHaptic('medium');
    setWatchingSlot(slotNum);
    setNotification(null);

    try {
      await adsgramService.showRewardedAd();
      const result = await tasksApi.complete(slotNum);

      if (result.success) {
        triggerHaptic('success');
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
      triggerHaptic('error');
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
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tv size={18} color="var(--accent-blue)" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{t('tasks.gridTitle')}</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t('tasks.gridSubtitle')}</p>
            </div>
          </div>
          <span className="badge badge-emerald">{t('tasks.adReward')}</span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '10px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('tasks.dailyProgress')}</span>
            <span className="tabular-nums" style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>
              {watchedCount} / {totalSlots} ({progressPercent}%)
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Cooldown Alert */}
        {cooldownTime > 0 && (
          <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Clock size={16} color="var(--accent-amber)" />
            <span className="tabular-nums" style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: '700' }}>
              {t('tasks.nextUnlock', { time: cooldownTime })}
            </span>
          </div>
        )}

        {/* Notification Alert */}
        {notification && (
          <div style={{
            marginTop: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : notification.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : notification.type === 'error' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} color={notification.type === 'success' ? 'var(--accent-emerald)' : notification.type === 'error' ? 'var(--accent-rose)' : 'var(--accent-blue)'} />
            <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '600' }}>{notification.text}</span>
          </div>
        )}
      </div>

      {/* Primary Ergonomic Thumb Action Button */}
      {nextTargetSlot <= totalSlots && (
        <button
          onClick={() => handleWatchAd(nextTargetSlot)}
          disabled={watchingSlot !== null || cooldownTime > 0}
          className="btn-primary"
          style={{
            background: cooldownTime > 0 ? 'rgba(15, 23, 42, 0.8)' : 'var(--gradient-primary)',
            border: cooldownTime > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : undefined,
            color: cooldownTime > 0 ? 'var(--accent-amber)' : '#fff',
            boxShadow: cooldownTime > 0 ? 'none' : '0 4px 20px rgba(6, 182, 212, 0.4)'
          }}
        >
          {watchingSlot === nextTargetSlot ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span>Playing Ad #{nextTargetSlot}...</span>
            </>
          ) : cooldownTime > 0 ? (
            <>
              <Clock size={16} color="var(--accent-amber)" />
              <span className="tabular-nums">Cooldown: {cooldownTime}s remaining</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>Watch Slot #{nextTargetSlot} (+${(0.005).toFixed(3)})</span>
            </>
          )}
        </button>
      )}

      {/* Grid Status Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.3)', border: '1px solid var(--accent-emerald)' }} />
          <span>{t('tasks.watched')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--gradient-primary)' }} />
          <span>{t('tasks.nextReady')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)' }} />
          <span>{t('tasks.locked')}</span>
        </div>
      </div>

      {/* 5-Column x 20-Row Grid (100 Slots) with Tactile Spring Taps */}
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
          let shadow = 'none';

          if (isWatched) {
            cardBg = 'rgba(16, 185, 129, 0.12)';
            borderColor = 'rgba(16, 185, 129, 0.35)';
          } else if (isCurrentTarget) {
            cardBg = 'linear-gradient(135deg, rgba(30, 58, 138, 0.75) 0%, rgba(14, 116, 144, 0.75) 100%)';
            borderColor = 'var(--accent-cyan)';
            shadow = '0 0 14px rgba(6, 182, 212, 0.45)';
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
                cursor: isWatched ? 'default' : 'pointer',
                opacity: isFutureLocked ? 0.65 : 1,
                position: 'relative',
                transition: 'transform 0.12s var(--ease-spring), border-color 0.15s ease',
                outline: 'none',
                touchAction: 'manipulation'
              }}
            >
              {isWatching ? (
                <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : isWatched ? (
                <>
                  <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-emerald)' }}>#{slotNumber}</span>
                  <CheckCircle size={14} color="var(--accent-emerald)" />
                </>
              ) : isCurrentTarget ? (
                <>
                  <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: '800', color: '#fff' }}>#{slotNumber}</span>
                  <PlayCircle size={14} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{t('tasks.watch')}</span>
                </>
              ) : (
                <>
                  <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>#{slotNumber}</span>
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
