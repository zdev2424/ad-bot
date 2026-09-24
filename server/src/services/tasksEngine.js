import db from '../db/index.js';
import { UserModel } from '../models/userModel.js';

const AD_REWARD_USD = 0.005; // $0.005 per ad
const COOLDOWN_SECONDS = 15;
const MAX_DAILY_ADS = 100;

export const TasksEngine = {
  /**
   * Returns current task/ad status for a user
   */
  getTaskStatus(telegramId) {
    const user = UserModel.getUserByTelegramId(telegramId);
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];

    // Get all completed slot numbers today
    const watchedRows = db.prepare(`
      SELECT slot_number, watched_at 
      FROM ad_watches 
      WHERE user_id = ? AND date_key = ?
      ORDER BY slot_number ASC
    `).all(user.id, today);

    const completedSlots = watchedRows.map((r) => r.slot_number);

    // Get latest ad watch to check cooldown
    const latestWatch = db.prepare(`
      SELECT watched_at 
      FROM ad_watches 
      WHERE user_id = ? 
      ORDER BY watched_at DESC 
      LIMIT 1
    `).get(user.id);

    let remainingCooldown = 0;
    if (latestWatch) {
      const lastWatchedTime = new Date(latestWatch.watched_at).getTime();
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastWatchedTime) / 1000);
      if (elapsedSeconds < COOLDOWN_SECONDS) {
        remainingCooldown = COOLDOWN_SECONDS - elapsedSeconds;
      }
    }

    return {
      completedSlots,
      adsWatchedToday: completedSlots.length,
      remainingAdsToday: Math.max(0, MAX_DAILY_ADS - completedSlots.length),
      maxDailyAds: MAX_DAILY_ADS,
      rewardPerAd: AD_REWARD_USD,
      remainingCooldown
    };
  },

  /**
   * Completes an ad watch slot and credits the user
   */
  completeAdWatch(telegramId, slotNumber) {
    const user = UserModel.getUserByTelegramId(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    const slot = parseInt(slotNumber, 10);
    if (isNaN(slot) || slot < 1 || slot > MAX_DAILY_ADS) {
      throw new Error(`Invalid slot number. Must be between 1 and ${MAX_DAILY_ADS}`);
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Check if user already hit daily cap
    const countRow = db.prepare(`
      SELECT COUNT(*) as count 
      FROM ad_watches 
      WHERE user_id = ? AND date_key = ?
    `).get(user.id, today);

    if (countRow && countRow.count >= MAX_DAILY_ADS) {
      throw new Error('Daily ad watch limit reached (100/100). Resets at 00:00 UTC.');
    }

    // 2. Check if this specific slot is already completed today
    const slotExists = db.prepare(`
      SELECT id 
      FROM ad_watches 
      WHERE user_id = ? AND date_key = ? AND slot_number = ?
    `).get(user.id, today, slot);

    if (slotExists) {
      throw new Error(`Slot #${slot} has already been completed today.`);
    }

    // 3. Enforce cooldown timer
    const latestWatch = db.prepare(`
      SELECT watched_at 
      FROM ad_watches 
      WHERE user_id = ? 
      ORDER BY watched_at DESC 
      LIMIT 1
    `).get(user.id);

    if (latestWatch) {
      const lastWatchedTime = new Date(latestWatch.watched_at).getTime();
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastWatchedTime) / 1000);
      if (elapsedSeconds < COOLDOWN_SECONDS) {
        const wait = COOLDOWN_SECONDS - elapsedSeconds;
        throw new Error(`Rate limited: Please wait ${wait} seconds before claiming another ad reward.`);
      }
    }

    // 4. Atomic Transaction: Record watch + credit user balance
    const recordAndCredit = db.transaction(() => {
      // Insert watch log
      db.prepare(`
        INSERT INTO ad_watches (user_id, slot_number, reward_amount, date_key, watched_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(user.id, slot, AD_REWARD_USD, today);

      // Increment user balance and total earned
      db.prepare(`
        UPDATE users 
        SET balance = balance + ?, 
            total_earned = total_earned + ?, 
            ads_watched_count = ads_watched_count + 1,
            last_active_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(AD_REWARD_USD, AD_REWARD_USD, user.id);
    });

    recordAndCredit();

    // Return fresh updated stats
    const updatedStats = UserModel.getUserStats(telegramId);
    const taskStatus = this.getTaskStatus(telegramId);

    return {
      success: true,
      reward: AD_REWARD_USD,
      slotNumber: slot,
      cooldownSeconds: COOLDOWN_SECONDS,
      user: updatedStats,
      tasks: taskStatus
    };
  }
};
