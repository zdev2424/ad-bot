import db from '../db/index.js';
import { UserModel } from '../models/userModel.js';

const REFERRAL_BONUS_USD = 0.05; // $0.05 per referral

export const ReferralService = {
  /**
   * Retrieves referral overview, links, and invited friends list for user
   */
  getReferralSummary(telegramId) {
    const user = UserModel.getUserByTelegramId(telegramId);
    if (!user) return null;

    const botUsername = process.env.BOT_USERNAME || 'EarnCashIOBot';
    const referralLink = `https://t.me/${botUsername}?start=ref_${telegramId}`;
    const shareText = `🚀 Join EarnCashIO and earn real cash by watching short video ads! Fast payouts & zero KYC: ${referralLink}`;
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;

    // Query all invited users
    const invitedRows = db.prepare(`
      SELECT 
        r.id,
        r.bonus_amount,
        r.created_at,
        u.first_name,
        u.last_name,
        u.username,
        u.ads_watched_count
      FROM referrals r
      LEFT JOIN users u ON r.referred_telegram_id = u.telegram_id
      WHERE r.referrer_telegram_id = ?
      ORDER BY r.created_at DESC
      LIMIT 50
    `).all(telegramId);

    const invitedFriends = invitedRows.map((row) => {
      const displayName = row.first_name ? `${row.first_name} ${row.last_name || ''}`.trim() : 'Telegram Earner';
      return {
        id: row.id,
        name: displayName,
        username: row.username ? `@${row.username}` : '@user',
        bonus: `+$${(row.bonus_amount || REFERRAL_BONUS_USD).toFixed(2)}`,
        adsWatched: row.ads_watched_count || 0,
        joinedAt: row.created_at
      };
    });

    return {
      referralLink,
      telegramShareUrl,
      referralCount: user.referral_count || invitedFriends.length,
      bonusPerReferral: REFERRAL_BONUS_USD,
      totalEarnedFromReferrals: parseFloat(((user.referral_count || invitedFriends.length) * REFERRAL_BONUS_USD).toFixed(2)),
      invitedFriends
    };
  }
};
