import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { WithdrawalService } from '../services/withdrawalService.js';

const router = express.Router();

/**
 * @route   GET /api/withdrawals/status
 * @desc    Returns eligibility gate progress and active withdrawal status
 * @access  Protected
 */
router.get('/status', requireTelegramAuth, (req, res) => {
  try {
    const status = WithdrawalService.getWithdrawalStatus(req.user.telegramId);
    if (!status) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/withdrawals/request
 * @desc    Requests withdrawal, validates gate, sets status to pending (v1: zero PII persisted)
 * @access  Protected
 */
router.post('/request', requireTelegramAuth, (req, res) => {
  try {
    const { devBypass } = req.body || {};
    const result = WithdrawalService.requestWithdrawal(req.user.telegramId, { devBypass });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
