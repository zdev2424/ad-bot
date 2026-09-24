import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { LeaderboardService } from '../services/leaderboardService.js';

const router = express.Router();

/**
 * @route   GET /api/leaderboard/data
 * @desc    Returns live leaderboard rankings, withdrawal activity stream, and trust metrics
 * @access  Protected
 */
router.get('/data', requireTelegramAuth, (req, res) => {
  try {
    const data = LeaderboardService.getLeaderboardData();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
