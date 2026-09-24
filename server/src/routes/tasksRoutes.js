import express from 'express';
import { requireTelegramAuth } from '../middleware/authMiddleware.js';
import { taskLimiter } from '../middleware/rateLimiter.js';
import { fraudGuard } from '../services/fraudGuard.js';
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
 * @desc    Validates completed ad view, runs fraud guard, and credits user balance
 * @access  Protected
 */
router.post('/complete', requireTelegramAuth, taskLimiter, (req, res) => {
  try {
    const { slotNumber } = req.body;
    if (!slotNumber) {
      return res.status(400).json({ success: false, error: 'slotNumber is required' });
    }

    // Run Fraud Guard checks (velocity & multi-accounting heuristics)
    const fraudCheck = fraudGuard.checkAdWatchVelocity(req.user.telegramId, req);
    if (!fraudCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: fraudCheck.reason
      });
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
