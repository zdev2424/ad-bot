import db from '../db/index.js';
import { UserModel } from '../models/userModel.js';
import { cacheLayer } from '../utils/cacheLayer.js';

export const DashboardService = {
  /**
   * Retrieves cache-backed aggregated stats for user's dashboard
   */
  getUserDashboardStats(telegramId) {
    const cacheKey = `dashboard_stats_${telegramId}`;
    const cached = cacheLayer.get(cacheKey);

    if (cached) {
      return cached;
    }

    const userStats = UserModel.getUserStats(telegramId);
    if (!userStats) return null;

    // Aggregate global platform highlights
    let globalStats = cacheLayer.get('global_platform_stats');
    if (!globalStats) {
      const totalAdsRow = db.prepare('SELECT COUNT(*) as count FROM ad_watches').get();
      const totalUsersRow = db.prepare('SELECT COUNT(*) as count FROM users').get();
      globalStats = {
        totalAdsServed: totalAdsRow ? totalAdsRow.count : 0,
        totalActiveUsers: totalUsersRow ? totalUsersRow.count : 0
      };
      cacheLayer.set('global_platform_stats', globalStats, 60); // 60s TTL
    }

    const dashboardPayload = {
      ...userStats,
      ratePerAd: 0.005,
      ratePerReferral: 0.05,
      maxDailyAds: 100,
      referralEarnings: parseFloat((userStats.referralCount * 0.05).toFixed(3)),
      global: globalStats,
      serverTime: new Date().toISOString()
    };

    // Cache user dashboard for 10 seconds
    cacheLayer.set(cacheKey, dashboardPayload, 10);

    return dashboardPayload;
  }
};
