import { verifyTelegramInitData, isUserAdmin } from '../utils/telegramAuth.js';

export function requireTelegramAuth(req, res, next) {
  // Extract initData from Authorization header: "Bearer <initData>" or "tma <initData>"
  const authHeader = req.headers['authorization'] || '';
  let initData = '';

  if (authHeader.startsWith('Bearer ') || authHeader.startsWith('tma ')) {
    initData = authHeader.slice(authHeader.indexOf(' ') + 1).trim();
  } else if (req.headers['x-telegram-init-data']) {
    initData = req.headers['x-telegram-init-data'];
  }

  // Development bypass helper if no initData is present and in dev mode
  if (!initData && process.env.NODE_ENV === 'development') {
    const mockId = req.headers['x-mock-telegram-id'] || '999999999';
    req.user = {
      telegramId: mockId,
      firstName: 'Dev',
      lastName: 'Tester',
      username: 'dev_tester',
      languageCode: 'en',
      isPremium: false,
      isAdmin: isUserAdmin(mockId),
      isDevMock: true
    };
    return next();
  }

  if (!initData) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing Telegram initData'
    });
  }

  const botToken = process.env.BOT_TOKEN;
  const verification = verifyTelegramInitData(initData, botToken);

  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      error: `Unauthorized: ${verification.error}`
    });
  }

  const tgUser = verification.user;
  if (!tgUser || !tgUser.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid user payload in initData'
    });
  }

  const telegramId = String(tgUser.id);
  const isAdmin = isUserAdmin(telegramId);

  req.user = {
    telegramId,
    firstName: tgUser.first_name || '',
    lastName: tgUser.last_name || '',
    username: tgUser.username || '',
    languageCode: tgUser.language_code || 'en',
    isPremium: tgUser.is_premium || false,
    startParam: verification.startParam || null,
    isAdmin
  };

  next();
}
