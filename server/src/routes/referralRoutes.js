import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { ReferralService } from '../services/referralService.js';

const router = express.Router();

/**
 * @route   GET /api/referrals/summary
 * @desc    Returns user's referral link, stats, and list of invited friends
 * @access  Protected
 */
router.get('/summary', requireTelegramAuth, (req, res) => {
  try {
    const summary = ReferralService.getReferralSummary(req.user.telegramId);
    if (!summary) {
      return res.status(404).json({ success: false, error: 'Referral profile not found' });
    }

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
