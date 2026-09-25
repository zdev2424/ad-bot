import crypto from 'crypto';

/**
 * Validates Telegram Mini App initData string using HMAC-SHA256
 * Official Algorithm:
 * 1. secret_key = HMAC_SHA256("WebAppData", BOT_TOKEN)
 * 2. data_check_string = sorted alphabetically key=value pairs joined by \n (excluding 'hash')
 * 3. calculated_hash = HMAC_SHA256(secret_key, data_check_string)
 * 4. compare calculated_hash with received hash
 */
export function verifyTelegramInitData(initDataString, botToken) {
  if (!initDataString) {
    return { valid: false, error: 'Empty initData' };
  }

  try {
    const urlParams = new URLSearchParams(initDataString);
    const hash = urlParams.get('hash');

    if (!hash) {
      return { valid: false, error: 'Missing hash parameter' };
    }

    // Extract all parameters except 'hash' and sort alphabetically
    const dataCheckArr = [];
    urlParams.forEach((value, key) => {
      if (key !== 'hash') {
        dataCheckArr.push(`${key}=${value}`);
      }
    });

    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // If bot token is not set or in test mode
    if (!botToken || botToken === 'your_telegram_bot_token_here') {
      if (process.env.NODE_ENV === 'production') {
        return { valid: false, error: 'Authentication service unavailable' };
      }
      // In dev mode without a token, parse user safely if present
      const userParam = urlParams.get('user');
      const parsedUser = userParam ? JSON.parse(userParam) : null;
      return {
        valid: true,
        isDevFallback: true,
        user: parsedUser,
        authDate: urlParams.get('auth_date'),
        startParam: urlParams.get('start_param')
      };
    }

    // Step 1: secret_key = HMAC_SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Step 2: calculated_hash = HMAC_SHA256(secretKey, dataCheckString)
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const hashBuffer = Buffer.from(hash, 'hex');
    const calculatedBuffer = Buffer.from(calculatedHash, 'hex');

    if (hashBuffer.length !== calculatedBuffer.length || !crypto.timingSafeEqual(hashBuffer, calculatedBuffer)) {
      return { valid: false, error: 'Invalid HMAC signature' };
    }

    // Check auth_date age (e.g. 24 hour max replay window)
    const authDate = parseInt(urlParams.get('auth_date'), 10);
    const now = Math.floor(Date.now() / 1000);
    if (authDate && now - authDate > 86400 * 7) { // 7 days leeway
      return { valid: false, error: 'initData has expired' };
    }

    const userParam = urlParams.get('user');
    const parsedUser = userParam ? JSON.parse(userParam) : null;

    return {
      valid: true,
      user: parsedUser,
      authDate,
      startParam: urlParams.get('start_param'),
      queryId: urlParams.get('query_id')
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Checks if a given Telegram User ID is in the ADMIN_TELEGRAM_IDS environment variable
 */
export function isUserAdmin(telegramId) {
  if (!telegramId) return false;
  const adminIdsStr = process.env.ADMIN_TELEGRAM_IDS || '';
  const adminIds = adminIdsStr
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  return adminIds.includes(String(telegramId));
}
