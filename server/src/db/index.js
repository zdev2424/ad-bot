import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists for SQLite
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'earncashio.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

/**
 * Initialize all database tables and indexes
 */
export function initDatabase() {
  db.exec(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id TEXT UNIQUE NOT NULL,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      balance REAL DEFAULT 0.00,
      total_earned REAL DEFAULT 0.00,
      ads_watched_count INTEGER DEFAULT 0,
      referral_count INTEGER DEFAULT 0,
      referred_by TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Ad Watches Table (Tracks every completed ad slot)
    CREATE TABLE IF NOT EXISTS ad_watches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      slot_number INTEGER NOT NULL,
      reward_amount REAL DEFAULT 0.005,
      date_key TEXT NOT NULL,
      watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Referrals Table (Tracks invite relationships)
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_telegram_id TEXT NOT NULL,
      referred_telegram_id TEXT UNIQUE NOT NULL,
      bonus_amount REAL DEFAULT 0.05,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Withdrawals Table (v1: Status queue tracking only, zero PII storage)
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Indexes for high performance reads
    CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
    CREATE INDEX IF NOT EXISTS idx_ad_watches_user_date ON ad_watches(user_id, date_key);
    CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_telegram_id);
    CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawals(user_id);
  `);

  console.log('✅ [Database] SQLite tables initialized successfully at:', dbPath);
}

export default db;
