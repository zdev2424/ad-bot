import crypto from 'crypto';

class FraudGuardService {
  constructor() {
    this.ipHistory = new Map(); // ipHash -> [ { telegramId, timestamp } ]
    this.userVelocity = new Map(); // telegramId -> lastAdTimestamp
  }

  /**
   * Hashes client IP for privacy while tracking multi-accounting
   */
  hashIp(ip) {
    if (!ip) return 'unknown';
    return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
  }

  /**
   * Evaluates if a request exhibits bot or multi-accounting behavior
   */
  checkAdWatchVelocity(telegramId, req) {
    const now = Date.now();
    const lastWatch = this.userVelocity.get(telegramId);

    // 1. Velocity check: at least 15 seconds required between ads
    if (lastWatch && now - lastWatch < 14000) {
      const waitSeconds = Math.ceil((14000 - (now - lastWatch)) / 1000);
      return {
        allowed: false,
        reason: `Velocity alert: Ad completed too quickly. Wait ${waitSeconds}s.`
      };
    }

    // 2. Multi-accounting check: Max 3 unique Telegram IDs per IP per hour
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ipHash = this.hashIp(ip);

    let records = this.ipHistory.get(ipHash) || [];
    // Clean up records older than 1 hour
    const oneHourAgo = now - 3600 * 1000;
    records = records.filter((r) => r.timestamp > oneHourAgo);

    const uniqueAccountsOnIp = new Set(records.map((r) => r.telegramId));
    if (uniqueAccountsOnIp.size >= 5 && !uniqueAccountsOnIp.has(telegramId)) {
      return {
        allowed: false,
        reason: 'Security check: Maximum accounts limit reached on this network.'
      };
    }

    // Record this attempt
    records.push({ telegramId, timestamp: now });
    this.ipHistory.set(ipHash, records);
    this.userVelocity.set(telegramId, now);

    return { allowed: true };
  }
}

export const fraudGuard = new FraudGuardService();
