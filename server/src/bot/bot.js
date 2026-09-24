import { Bot, InlineKeyboard } from 'grammy';
import { UserModel } from '../models/userModel.js';

let bot = null;

export function initTelegramBot() {
  const token = process.env.BOT_TOKEN;

  if (!token || token === 'your_telegram_bot_token_here') {
    console.log('⚠️ [Telegram Bot] No valid BOT_TOKEN provided in .env. Bot polling skipped for now.');
    return null;
  }

  try {
    bot = new Bot(token);

    // Handle /start command with optional referral parameter
    bot.command('start', async (ctx) => {
      const from = ctx.from;
      if (!from) return;

      const startPayload = ctx.match; // captures "?start=payload"

      // Register or find user in database
      const user = UserModel.findOrCreateUser({
        telegramId: String(from.id),
        firstName: from.first_name,
        lastName: from.last_name,
        username: from.username
      }, startPayload);

      const miniAppUrl = process.env.CLIENT_URL || 'http://localhost:5173';

      const keyboard = new InlineKeyboard()
        .webApp('🚀 Launch EarnCashIO Mini App', miniAppUrl)
        .row()
        .url('👥 Invite Friends', `https://t.me/share/url?url=https://t.me/${ctx.me.username}?start=ref_${from.id}&text=Join%20EarnCashIO%20and%20earn%20rewards%20by%20watching%20ads!`);

      const welcomeMessage = `👋 **Welcome to EarnCashIO, ${from.first_name}!**\n\n` +
        `💰 **Watch Ads • Refer Friends • Earn Crypto Rewards**\n\n` +
        `• 📺 **100 Daily Ad Slots**: Earn on every ad you watch.\n` +
        `• 👥 **$0.05 Per Referral**: Invite friends and earn commission.\n` +
        `• ⚡ **Zero-Friction Payouts**: Fast withdrawals.\n\n` +
        `Tap the button below to start earning right now! 👇`;

      await ctx.reply(welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    });

    // Handle /help command
    bot.command('help', async (ctx) => {
      await ctx.reply(
        `ℹ️ **EarnCashIO Help Center**\n\n` +
        `1. Tap **Launch EarnCashIO Mini App** to open the dashboard.\n` +
        `2. Go to **Tasks** tab to watch rewarded ads.\n` +
        `3. Go to **Refer** tab to get your personal invite link.\n` +
        `4. Watch at least 20 ads and invite 10 friends to unlock the **Withdraw** tab.\n\n` +
        `Need support? Contact our admin team.`,
        { parse_mode: 'Markdown' }
      );
    });

    // Start bot in long polling mode for development
    bot.start({
      onStart: (botInfo) => {
        console.log(`🤖 [Telegram Bot] @${botInfo.username} started successfully!`);
      }
    });

    return bot;
  } catch (error) {
    console.error('❌ [Telegram Bot] Initialization error:', error.message);
    return null;
  }
}
