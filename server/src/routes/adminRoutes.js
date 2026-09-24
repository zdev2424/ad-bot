import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { requireAdminAuth } from '../middleware/adminMiddleware.js';
import { AdminService } from '../services/adminService.js';

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

export default router;
