import rateLimit from 'express-rate-limit';

/**
 * Standard Global API Rate Limiter
 * 100 requests per 15 minutes per IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.'
  }
});

/**
 * Strict Ad Watch Rate Limiter
 * Maximum 6 ad claims per minute (enforcing realistic human viewing speed)
 */
export const taskLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Ad completion rate limit exceeded. Please wait between ads.'
  }
});

/**
 * Auth Verification Rate Limiter
 * Maximum 30 auth requests per minute
 */
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.'
  }
});

/**
 * Channel Verification Rate Limiter
 * Maximum 10 verification checks per minute (protects Telegram Bot API flood limits)
 */
export const channelVerifyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Verification rate limit exceeded. Please wait a moment before trying again.'
  }
});
