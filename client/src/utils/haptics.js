/**
 * Telegram Mini App Native Haptics & Ergonomic Feedback Layer
 * Gracefully integrates with Telegram WebApp SDK or falls back safely in browser dev mode.
 */

export const triggerHaptic = (type = 'light') => {
  try {
    const tg = window.Telegram?.WebApp?.HapticFeedback;
    if (!tg) return;

    switch (type) {
      case 'light':
        tg.impactOccurred('light');
        break;
      case 'medium':
        tg.impactOccurred('medium');
        break;
      case 'heavy':
        tg.impactOccurred('heavy');
        break;
      case 'rigid':
        tg.impactOccurred('rigid');
        break;
      case 'soft':
        tg.impactOccurred('soft');
        break;
      case 'success':
        tg.notificationOccurred('success');
        break;
      case 'warning':
        tg.notificationOccurred('warning');
        break;
      case 'error':
        tg.notificationOccurred('error');
        break;
      case 'selection':
        tg.selectionChanged();
        break;
      default:
        tg.impactOccurred('light');
    }
  } catch (err) {
    // Non-blocking fallback for standard browsers
  }
};
