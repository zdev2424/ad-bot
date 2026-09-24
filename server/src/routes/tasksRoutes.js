import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { TasksEngine } from '../services/tasksEngine.js';

const router = express.Router();

/**
 * @route   GET /api/tasks/status
 * @desc    Returns user's completed slots, remaining daily ads, and active cooldown
 * @access  Protected
 */
router.get('/status', requireTelegramAuth, (req, res) => {
  try {
    const status = TasksEngine.getTaskStatus(req.user.telegramId);
    if (!status) {
      return res.status(404).json({ success: false, error: 'User task profile not found' });
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
 * @route   POST /api/tasks/complete
 * @desc    Validates completed ad view and credits user balance
 * @access  Protected
 */
router.post('/complete', requireTelegramAuth, (req, res) => {
  try {
    const { slotNumber } = req.body;
    if (!slotNumber) {
      return res.status(400).json({ success: false, error: 'slotNumber is required' });
    }

    const result = TasksEngine.completeAdWatch(req.user.telegramId, slotNumber);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
