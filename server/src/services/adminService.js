import db from '../db/index.js';

export const AdminService = {
  /**
   * Returns platform-wide KPI statistics
   */
  getOverview() {
    const totalUsersRow = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const totalAdsRow = db.prepare('SELECT COUNT(*) as count FROM ad_watches').get();
    const totalRefsRow = db.prepare('SELECT COUNT(*) as count FROM referrals').get();
    const pendingWithdrawalsRow = db.prepare("SELECT COUNT(*) as count FROM withdrawals WHERE status = 'pending'").get();
    const totalPaidRow = db.prepare("SELECT SUM(amount) as total FROM withdrawals WHERE status = 'approved' OR status = 'completed'").get();

    const totalAds = totalAdsRow ? totalAdsRow.count : 0;
    const estimatedGrossRevenue = parseFloat((totalAds * 0.0035).toFixed(2)); // estimated eCPM ($3.50 per 1000 views)

    return {
      totalUsers: totalUsersRow ? totalUsersRow.count : 0,
      totalAdsServed: totalAds,
      totalReferrals: totalRefsRow ? totalRefsRow.count : 0,
      pendingWithdrawalsCount: pendingWithdrawalsRow ? pendingWithdrawalsRow.count : 0,
      totalPaidOut: parseFloat(((totalPaidRow ? totalPaidRow.total : 0) || 0).toFixed(2)),
      estimatedGrossRevenue: Math.max(0.00, estimatedGrossRevenue),
      systemStatus: 'Operational',
      adNetwork: 'Adsgram (Connected)'
    };
  },

  /**
   * Returns all pending and recent withdrawal requests with user context
   */
  getWithdrawalQueue() {
    const rows = db.prepare(`
      SELECT 
        w.id,
        w.amount,
        w.status,
        w.created_at as requestedAt,
        w.processed_at as processedAt,
        u.telegram_id as telegramId,
        u.username,
        u.first_name as firstName,
        u.last_name as lastName,
        u.ads_watched_count as adsWatched,
        u.referral_count as referralsCount,
        u.balance as currentBalance
      FROM withdrawals w
      JOIN users u ON w.user_id = u.id
      ORDER BY 
        CASE WHEN w.status = 'pending' THEN 1 ELSE 2 END,
        w.created_at DESC
      LIMIT 100
    `).all();

    return rows.map((r) => {
      const displayUsername = r.username ? `@${r.username}` : (r.firstName || 'User');
      return {
        id: r.id,
        telegramId: r.telegramId,
        username: displayUsername,
        adsWatched: r.adsWatched || 0,
        refs: r.referralsCount || 0,
        amount: `$${r.amount.toFixed(2)}`,
        rawAmount: r.amount,
        status: r.status,
        requestedAt: r.requestedAt
      };
    });
  },

  /**
   * Approves or rejects a withdrawal request
   */
  updateWithdrawalStatus(withdrawalId, action) {
    const validActions = ['approved', 'rejected', 'pending'];
    if (!validActions.includes(action)) {
      throw new Error(`Invalid action. Must be one of: ${validActions.join(', ')}`);
    }

    const withdrawal = db.prepare('SELECT * FROM withdrawals WHERE id = ?').get(withdrawalId);
    if (!withdrawal) {
      throw new Error('Withdrawal request not found');
    }

    const updateTx = db.transaction(() => {
      db.prepare(`
        UPDATE withdrawals 
        SET status = ?, processed_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(action, withdrawalId);

      // If approved, deduct the requested amount from user's current balance
      if (action === 'approved' && withdrawal.status === 'pending') {
        db.prepare(`
          UPDATE users 
          SET balance = MAX(0.00, balance - ?) 
          WHERE id = ?
        `).run(withdrawal.amount, withdrawal.user_id);
      }
    });

    updateTx();

    return {
      success: true,
      id: withdrawalId,
      status: action,
      message: `Withdrawal #${withdrawalId} marked as ${action}`
    };
  }
};
