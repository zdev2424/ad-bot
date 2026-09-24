import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/index.js';
import { initTelegramBot } from './bot/bot.js';
import authRoutes from './routes/authRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config({ path: '../.env' });
dotenv.config(); // fallback to local .env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize Database Schemas
initDatabase();

// Initialize Telegram Bot (if BOT_TOKEN is present)
initTelegramBot();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint (also used by keep-alive pings)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'EarnCashIO Backend',
    database: 'SQLite (WAL mode)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to EarnCashIO API',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [EarnCashIO Server] running on http://localhost:${PORT}`);
});
