import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/verify
 * @desc    Validates Telegram initData and returns the verified user session
 * @access  Protected by Telegram initData
 */
router.post('/verify', requireTelegramAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: 'Telegram authentication verified successfully'
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Returns current authenticated user and admin status
 * @access  Protected
 */
router.get('/me', requireTelegramAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
