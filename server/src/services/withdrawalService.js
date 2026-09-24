import db from '../db/index.js';
import { UserModel } from '../models/userModel.js';

const REQUIRED_ADS_WATCHED = 20;
const REQUIRED_REFERRALS = 10;

export const WithdrawalService = {
  /**
   * Retrieves eligibility status and active withdrawal queue status for user
   */
  getWithdrawalStatus(telegramId) {
    const user = UserModel.getUserByTelegramId(telegramId);
    if (!user) return null;

    const adsWatched = user.ads_watched_count || 0;
    const referrals = user.referral_count || 0;
    const isEligible = adsWatched >= REQUIRED_ADS_WATCHED && referrals >= REQUIRED_REFERRALS;

    // Check existing withdrawal queue record
    const latestWithdrawal = db.prepare(`
      SELECT id, amount, status, created_at 
      FROM withdrawals 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `).get(user.id);

    return {
      balance: parseFloat(user.balance.toFixed(4)),
      status: latestWithdrawal ? latestWithdrawal.status : 'none',
      latestRequest: latestWithdrawal || null,
      eligibility: {
        isEligible,
        adsWatched,
        adsRequired: REQUIRED_ADS_WATCHED,
        referralsCount: referrals,
        referralsRequired: REQUIRED_REFERRALS
      }
    };
  },

  /**
   * Creates a withdrawal request (v1 Placeholder: status flag flip only, zero PII storage)
   */
  requestWithdrawal(telegramId, options = {}) {
    const user = UserModel.getUserByTelegramId(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.balance <= 0) {
      throw new Error('Your balance is $0.00. Watch ads to earn before withdrawing.');
    }

    // Check if user already has an active pending request
    const activeRequest = db.prepare(`
      SELECT id, status 
      FROM withdrawals 
      WHERE user_id = ? AND status IN ('pending', 'in_queue')
    `).get(user.id);

    if (activeRequest) {
      throw new Error('You already have an active withdrawal in queue.');
    }

    const adsWatched = user.ads_watched_count || 0;
    const referrals = user.referral_count || 0;
    const isEligible = (adsWatched >= REQUIRED_ADS_WATCHED && referrals >= REQUIRED_REFERRALS) || options.devBypass;

    if (!isEligible) {
      throw new Error(`Eligibility gate locked: Requires at least ${REQUIRED_ADS_WATCHED} ads watched and ${REQUIRED_REFERRALS} referrals.`);
    }

    // Insert withdrawal queue entry (v1: status flag only, no payment address stored)
    const insertStmt = db.prepare(`
      INSERT INTO withdrawals (user_id, amount, status, created_at)
      VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)
    `);

    insertStmt.run(user.id, user.balance);

    return {
      success: true,
      status: 'pending',
      amount: user.balance,
      message: 'Withdrawal requested successfully and placed in review queue.'
    };
  }
};
