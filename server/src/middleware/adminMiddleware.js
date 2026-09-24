import { isUserAdmin } from '../utils/telegramAuth.js';

export function requireAdminAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Authentication required' });
  }

  // In development, allow admin access if configured or flagged
  if (process.env.NODE_ENV === 'development' && (req.user.isAdmin || req.headers['x-mock-admin'] === 'true')) {
    return next();
  }

  const isAdmin = req.user.isAdmin || isUserAdmin(req.user.telegramId);

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Admin access privileges required'
    });
  }

  next();
}
