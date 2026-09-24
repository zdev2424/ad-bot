import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { UserModel } from '../models/userModel.js';

const router = express.Router();

/**
 * @route   POST /api/auth/verify
 * @desc    Validates Telegram initData, registers/finds user in DB, and returns full profile & stats
 * @access  Protected by Telegram initData
 */
router.post('/verify', requireTelegramAuth, (req, res) => {
  try {
    // Look up or create user in SQLite database
    const dbUser = UserModel.findOrCreateUser(req.user, req.user.startParam);
    const userStats = UserModel.getUserStats(req.user.telegramId);

    res.json({
      success: true,
      user: {
        ...req.user,
        ...userStats
      },
      message: 'User authenticated and synchronized with database'
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to synchronize user with database'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Returns current authenticated user and live database stats
 * @access  Protected
 */
router.get('/me', requireTelegramAuth, (req, res) => {
  try {
    const userStats = UserModel.getUserStats(req.user.telegramId);
    if (!userStats) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        ...req.user,
        ...userStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
