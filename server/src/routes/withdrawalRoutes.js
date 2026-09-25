import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { WithdrawalService } from '../services/withdrawalService.js';
import { ChannelService } from '../services/channelService.js';

const router = express.Router();

/**
 * @route   GET /api/withdrawals/status
 * @desc    Returns eligibility progress and active withdrawal status
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
 * @route   GET /api/withdrawals/channels
 * @desc    Returns active required Telegram channels with user join status
 * @access  Protected
 */
router.get('/channels', requireTelegramAuth, (req, res) => {
  try {
    const channelData = ChannelService.getChannelsForUser(req.user.telegramId);
    res.json({
      success: true,
      data: channelData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/withdrawals/verify-channel
 * @desc    Verifies user membership in a specific Telegram channel
 * @access  Protected
 */
router.post('/verify-channel', requireTelegramAuth, async (req, res) => {
  try {
    const { channelId } = req.body;
    if (!channelId) {
      return res.status(400).json({ success: false, error: 'channelId is required' });
    }

    const result = await ChannelService.verifyChannelJoin(req.user.telegramId, channelId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/withdrawals/request
 * @desc    Requests withdrawal, validates requirements, sets status to pending
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

