import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { DashboardService } from '../services/dashboardService.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Returns cache-backed live metrics for user's dashboard
 * @access  Protected
 */
router.get('/stats', requireTelegramAuth, (req, res) => {
  try {
    const stats = DashboardService.getUserDashboardStats(req.user.telegramId);
    if (!stats) {
      return res.status(404).json({ success: false, error: 'Dashboard profile not found' });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
