import db from '../db/index.js';
import { UserModel } from '../models/userModel.js';

let botInstance = null;

export function setBotInstance(bot) {
  botInstance = bot;
}

export const ChannelService = {
  /**
   * Returns list of required active channels with user join status
   */
  getChannelsForUser(telegramId) {
    const user = UserModel.getUserByTelegramId(telegramId);
    if (!user) return { channels: [], allJoined: false, joinedCount: 0, totalCount: 0 };

    const activeChannels = db.prepare(`
      SELECT id, name, username, url, type, is_active 
      FROM channels 
      WHERE is_active = 1
      ORDER BY id ASC
    `).all();

    if (activeChannels.length === 0) {
      return { channels: [], allJoined: true, joinedCount: 0, totalCount: 0 };
    }

    const verifiedJoins = db.prepare(`
      SELECT channel_id 
      FROM user_channels 
      WHERE user_id = ?
    `).all(user.id).map(r => r.channel_id);

    const channelsWithStatus = activeChannels.map(c => ({
      ...c,
      isJoined: verifiedJoins.includes(c.id)
    }));

    const joinedCount = channelsWithStatus.filter(c => c.isJoined).length;
    const allJoined = joinedCount === activeChannels.length;

    return {
      channels: channelsWithStatus,
      allJoined,
      joinedCount,
      totalCount: activeChannels.length
    };
  },

  /**
   * Verifies if user has joined a specific Telegram channel
   */
  async verifyChannelJoin(telegramId, channelId) {
    const user = UserModel.getUserByTelegramId(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    const channel = db.prepare('SELECT * FROM channels WHERE id = ? AND is_active = 1').get(channelId);
    if (!channel) {
      throw new Error('Channel not found or inactive');
    }

    let isMember = true;

    // Real Telegram Bot API Verification if bot token is active
    if (botInstance && botInstance.api) {
      try {
        const chatIdentifier = channel.username.startsWith('@') ? channel.username : `@${channel.username}`;
        const chatMember = await botInstance.api.getChatMember(chatIdentifier, Number(telegramId));
        
        const validStatuses = ['member', 'administrator', 'creator', 'restricted'];
        isMember = validStatuses.includes(chatMember?.status);
      } catch (err) {
        console.warn(`⚠️ [Telegram Channel Verification] Bot query for ${channel.username} returned: ${err.message}. Falling back to click confirmation.`);
        isMember = true; // Fallback so users aren't blocked if bot is not yet admin of channel
      }
    }

    if (!isMember) {
      return {
        success: false,
        channelId,
        isJoined: false,
        message: `Please join ${channel.name} (${channel.username}) first, then tap Verify.`
      };
    }

    // Record verified membership in database
    db.prepare(`
      INSERT OR IGNORE INTO user_channels (user_id, channel_id, verified_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).run(user.id, channel.id);

    return {
      success: true,
      channelId,
      isJoined: true,
      message: `Verified! You are now subscribed to ${channel.name}.`
    };
  },

  /**
   * Admin Methods for Channel Management
   */
  getAllChannels() {
    return db.prepare('SELECT * FROM channels ORDER BY id ASC').all();
  },

  addChannel({ name, username, url, type = 'official', is_active = 1 }) {
    const cleanUsername = username.startsWith('@') ? username : `@${username}`;
    const cleanUrl = url || `https://t.me/${cleanUsername.replace('@', '')}`;
    
    const stmt = db.prepare(`
      INSERT INTO channels (name, username, url, type, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, cleanUsername, cleanUrl, type, is_active ? 1 : 0);
    return {
      id: result.lastInsertRowid,
      name,
      username: cleanUsername,
      url: cleanUrl,
      type,
      is_active: is_active ? 1 : 0
    };
  },

  deleteChannel(id) {
    db.prepare('DELETE FROM channels WHERE id = ?').run(id);
    return { success: true, id };
  },

  toggleChannel(id, isActive) {
    db.prepare('UPDATE channels SET is_active = ? WHERE id = ?').run(isActive ? 1 : 0, id);
    return { success: true, id, is_active: isActive ? 1 : 0 };
  }
};
