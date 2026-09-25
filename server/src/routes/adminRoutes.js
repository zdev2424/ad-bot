import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { requireAdminAuth } from '../middleware/adminMiddleware.js';
import { AdminService } from '../services/adminService.js';
import { ChannelService } from '../services/channelService.js';

const router = express.Router();

// Apply Telegram auth + Admin check to all admin routes
router.use(requireTelegramAuth, requireAdminAuth);

/**
 * @route   GET /api/admin/overview
 * @desc    Returns platform KPIs, users count, ads count, revenue estimate
 * @access  Protected (Admin only)
 */
router.get('/overview', (req, res) => {
  try {
    const overview = AdminService.getOverview();
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/admin/withdrawals
 * @desc    Returns active withdrawal queue
 * @access  Protected (Admin only)
 */
router.get('/withdrawals', (req, res) => {
  try {
    const queue = AdminService.getWithdrawalQueue();
    res.json({
      success: true,
      data: queue
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/admin/withdrawals/:id/action
 * @desc    Approves or rejects a withdrawal request
 * @access  Protected (Admin only)
 */
router.post('/withdrawals/:id/action', (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, error: 'action (approved|rejected) is required' });
    }

    const result = AdminService.updateWithdrawalStatus(id, action);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/admin/channels
 * @desc    Returns all configured Telegram & Sponsor channels
 * @access  Protected (Admin only)
 */
router.get('/channels', (req, res) => {
  try {
    const channels = ChannelService.getAllChannels();
    res.json({
      success: true,
      data: channels
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/admin/channels
 * @desc    Adds a new required Telegram or sponsor channel
 * @access  Protected (Admin only)
 */
router.post('/channels', (req, res) => {
  try {
    const { name, username, url, type, is_active } = req.body;
    if (!name || !username) {
      return res.status(400).json({ success: false, error: 'name and username are required' });
    }

    const newChannel = ChannelService.addChannel({ name, username, url, type, is_active });
    res.json({
      success: true,
      data: newChannel
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route   DELETE /api/admin/channels/:id
 * @desc    Deletes a required Telegram channel
 * @access  Protected (Admin only)
 */
router.delete('/channels/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = ChannelService.deleteChannel(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/admin/channels/:id/toggle
 * @desc    Toggles channel active status
 * @access  Protected (Admin only)
 */
router.post('/channels/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const result = ChannelService.toggleChannel(id, is_active);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;

