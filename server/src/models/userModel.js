import db from '../db/index.js';
import { isUserAdmin } from '../utils/telegramAuth.js';

export const UserModel = {
  /**
   * Finds an existing user or creates a new one with optional referral linking
   */
  findOrCreateUser(tgUser, startParam = null) {
    const telegramId = String(tgUser.telegramId || tgUser.id);
    const firstName = tgUser.firstName || tgUser.first_name || '';
    const lastName = tgUser.lastName || tgUser.last_name || '';
    const username = tgUser.username || '';
    const isAdmin = isUserAdmin(telegramId) ? 1 : 0;

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId);

    if (existingUser) {
      // Update basic details and activity timestamp
      db.prepare(`
        UPDATE users 
        SET username = ?, first_name = ?, last_name = ?, is_admin = ?, last_active_at = CURRENT_TIMESTAMP
        WHERE telegram_id = ?
      `).run(username, firstName, lastName, isAdmin, telegramId);

      return this.getUserByTelegramId(telegramId);
    }

    // New user registration flow
    let referredBy = null;

    // Parse start parameter for referral code: e.g. "ref_123456789" or "123456789"
    if (startParam) {
      const match = startParam.startsWith('ref_') ? startParam.replace('ref_', '') : startParam;
      if (match && match !== telegramId) {
        const referrer = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(match);
        if (referrer) {
          referredBy = match;
        }
      }
    }

    // Insert new user into database
    const insertUser = db.prepare(`
      INSERT INTO users (telegram_id, username, first_name, last_name, balance, total_earned, ads_watched_count, referral_count, referred_by, is_admin)
      VALUES (?, ?, ?, ?, 0.00, 0.00, 0, 0, ?, ?)
    `);

    const result = insertUser.run(telegramId, username, firstName, lastName, referredBy, isAdmin);
    const newUserId = result.lastInsertRowid;

    // If referred by another user, record referral relationship and award commission
    if (referredBy) {
      try {
        const referralBonus = 0.05; // $0.05 per referral
        db.prepare(`
          INSERT INTO referrals (referrer_telegram_id, referred_telegram_id, bonus_amount)
          VALUES (?, ?, ?)
        `).run(referredBy, telegramId, referralBonus);

        // Credit referrer balance and increment referral count
        db.prepare(`
          UPDATE users 
          SET balance = balance + ?, total_earned = total_earned + ?, referral_count = referral_count + 1
          WHERE telegram_id = ?
        `).run(referralBonus, referralBonus, referredBy);
      } catch (err) {
        console.warn('Referral recording warning:', err.message);
      }
    }

    return this.getUserByTelegramId(telegramId);
  },

  /**
   * Retrieves user record by Telegram ID
   */
  getUserByTelegramId(telegramId) {
    return db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(telegramId));
  },

  /**
   * Retrieves aggregated stats for user (dashboard, task limits, eligibility)
   */
  getUserStats(telegramId) {
    const user = this.getUserByTelegramId(telegramId);
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Count ads watched today
    const adsTodayRow = db.prepare(`
      SELECT COUNT(*) as count 
      FROM ad_watches 
      WHERE user_id = ? AND date_key = ?
    `).get(user.id, today);

    const adsWatchedToday = adsTodayRow ? adsTodayRow.count : 0;

    // Check latest withdrawal status
    const latestWithdrawal = db.prepare(`
      SELECT status, created_at 
      FROM withdrawals 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `).get(user.id);

    // Eligibility check for v1: ≥ 20 total ads watched AND ≥ 10 referrals
    const meetsAdRequirement = user.ads_watched_count >= 20;
    const meetsReferralRequirement = user.referral_count >= 10;
    const isEligibleToWithdraw = meetsAdRequirement && meetsReferralRequirement;

    return {
      id: user.id,
      telegramId: user.telegram_id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      balance: parseFloat(user.balance.toFixed(4)),
      totalEarned: parseFloat(user.total_earned.toFixed(4)),
      adsWatchedTotal: user.ads_watched_count,
      adsWatchedToday: adsWatchedToday,
      remainingAdsToday: Math.max(0, 100 - adsWatchedToday),
      referralCount: user.referral_count,
      referredBy: user.referred_by,
      isAdmin: Boolean(user.is_admin),
      withdrawalStatus: latestWithdrawal ? latestWithdrawal.status : 'none',
      eligibility: {
        isEligible: isEligibleToWithdraw,
        adsWatched: user.ads_watched_count,
        adsRequired: 20,
        referralsCount: user.referral_count,
        referralsRequired: 10
      }
    };
  }
};
