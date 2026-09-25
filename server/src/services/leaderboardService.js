import db from '../db/index.js';
import { cacheLayer } from '../utils/cacheLayer.js';

export const LeaderboardService = {
  /**
   * Helper to mask any user id into an anonymous tag like user48**92
   */
  maskUsername(identifier) {
    if (!identifier) return 'user' + Math.floor(10 + Math.random() * 89) + '**' + Math.floor(10 + Math.random() * 89);
    const str = String(identifier).replace('@', '');
    if (str.length <= 4) {
      return 'user' + str.slice(0, 2) + '**' + (str.slice(2) || '88');
    }
    return 'user' + str.slice(0, 2) + '**' + str.slice(-2);
  },

  /**
   * Generates a realistic weekly leaderboard that automatically rotates week-over-week
   */
  getWeeklyTopEarners() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.floor(((now - startOfYear) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7);

    // Dynamic top weekly base amount (e.g., $9.20 to $11.80 depending on week)
    const baseTop = 9.20 + ((weekNumber * 3) % 25) * 0.10;
    const rankBadges = ['🥇', '🥈', '🥉', '#4', '#5', '#6', '#7', '#8', '#9', '#10'];

    const userPool = [
      'user94**12', 'user78**35', 'user51**80', 'user33**49', 'user82**06',
      'user19**67', 'user60**23', 'user45**91', 'user28**74', 'user11**59',
      'user64**28', 'user92**15', 'user47**33', 'user85**09', 'user20**76'
    ];

    // Shift user pool deterministically per week
    const shift = weekNumber % userPool.length;
    const shiftedUsers = [...userPool.slice(shift), ...userPool.slice(0, shift)];

    // Strictly descending step-downs
    const stepDowns = [0, 1.95, 3.40, 4.55, 5.15, 5.65, 6.05, 6.35, 6.65, 6.95];

    return rankBadges.map((badge, idx) => {
      const earnedVal = Math.max(2.60, parseFloat((baseTop - stepDowns[idx]).toFixed(2)));
      const refsCount = Math.max(7, Math.round(earnedVal * 2.8 + ((weekNumber + idx) % 3)));
      return {
        rank: idx + 1,
        name: shiftedUsers[idx] || `user${idx + 10}**${idx + 20}`,
        refs: refsCount,
        earned: `$${earnedVal.toFixed(2)}`,
        badge: badge
      };
    });
  },

  /**
   * Returns live leaderboard data, auto-slider withdrawals, and dynamic weekly top earners rankings
   */
  getLeaderboardData() {
    const cached = cacheLayer.get('leaderboard_data');
    if (cached) return cached;

    // 1. Query top earners from SQLite database
    const topUsers = db.prepare(`
      SELECT 
        username,
        first_name,
        telegram_id,
        referral_count,
        total_earned
      FROM users
      ORDER BY total_earned DESC, referral_count DESC
      LIMIT 10
    `).all();

    const rankBadges = ['🥇', '🥈', '🥉', '#4', '#5', '#6', '#7', '#8', '#9', '#10'];

    const formattedTopEarners = topUsers.map((u, idx) => {
      const maskedName = this.maskUsername(u.telegram_id || u.username || idx + 101);
      return {
        rank: idx + 1,
        name: maskedName,
        refs: u.referral_count || 0,
        earned: `$${(u.total_earned || 0).toFixed(2)}`,
        badge: rankBadges[idx] || `#${idx + 1}`
      };
    });

    // Merge with dynamic weekly earners to ensure full 10 ranked entries in order
    const dynamicWeeklySeeds = this.getWeeklyTopEarners();

    if (formattedTopEarners.length < 10) {
      dynamicWeeklySeeds.forEach((s) => {
        if (!formattedTopEarners.find((e) => e.name === s.name) && formattedTopEarners.length < 10) {
          formattedTopEarners.push({
            ...s,
            rank: formattedTopEarners.length + 1,
            badge: rankBadges[formattedTopEarners.length] || `#${formattedTopEarners.length + 1}`
          });
        }
      });
    }

    // Sort strictly descending by earned value
    formattedTopEarners.sort((a, b) => {
      const numA = parseFloat(String(a.earned).replace('$', '')) || 0;
      const numB = parseFloat(String(b.earned).replace('$', '')) || 0;
      return numB - numA;
    });

    // Re-assign ranks 1..10
    const finalTopEarners = formattedTopEarners.slice(0, 10).map((item, idx) => ({
      ...item,
      rank: idx + 1,
      badge: rankBadges[idx] || `#${idx + 1}`
    }));

    // 2. Realistic recent withdrawals for the live auto-slider
    const recentWithdrawals = [
      { id: 1, user: 'user123**22', amount: '$3.00', time: '12m ago', method: 'M-Pesa', flag: '🇰🇪' },
      { id: 2, user: 'user489**01', amount: '$5.50', time: '38m ago', method: 'UPI', flag: '🇮🇳' },
      { id: 3, user: 'user782**90', amount: '$2.75', time: '1h ago', method: 'DANA', flag: '🇮🇩' },
      { id: 4, user: 'user614**33', amount: '$4.00', time: '2h ago', method: 'Telebirr', flag: '🇪🇹' },
      { id: 5, user: 'user905**12', amount: '$6.20', time: '3h ago', method: 'USDT (TON)', flag: '💎' },
      { id: 6, user: 'user341**77', amount: '$2.50', time: '4h ago', method: 'Airtel Money', flag: '🇰🇪' },
      { id: 7, user: 'user529**64', amount: '$4.50', time: '6h ago', method: 'Bank (IMPS)', flag: '🇮🇳' },
      { id: 8, user: 'user218**85', amount: '$3.25', time: '8h ago', method: 'GoPay', flag: '🇮🇩' },
      { id: 9, user: 'user834**19', amount: '$5.00', time: '11h ago', method: 'CBE Bank', flag: '🇪🇹' },
      { id: 10, user: 'user107**46', amount: '$4.80', time: '14h ago', method: 'USDT (TRC20)', flag: '💵' },
      { id: 11, user: 'user672**53', amount: '$3.50', time: '18h ago', method: 'GCash', flag: '🇵🇭' },
      { id: 12, user: 'user493**28', amount: '$4.00', time: 'yesterday', method: 'OPay', flag: '🇳🇬' },
      { id: 13, user: 'user315**88', amount: '$5.25', time: 'yesterday', method: 'TON Wallet', flag: '💎' },
      { id: 14, user: 'user720**14', amount: '$3.00', time: '2 days ago', method: 'Telebirr', flag: '🇪🇹' }
    ];

    const payload = {
      recentWithdrawals,
      topEarners: finalTopEarners,
      platformStats: {
        totalPaidOut: '$386.50+',
        avgProcessingTime: '~2 Hours',
        payoutSuccessRate: '100%'
      }
    };

    // Cache leaderboard data for 30 seconds
    cacheLayer.set('leaderboard_data', payload, 30);

    return payload;
  }
};
