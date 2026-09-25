import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { globalLimiter } from './middleware/rateLimiter.js';
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

// Security Headers (configured to allow Telegram WebApp iframe embedding)
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: false
  })
);

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());

// Apply global rate limiting
app.use(globalLimiter);

// Initialize Database Schemas
initDatabase();

// Initialize Telegram Bot (if BOT_TOKEN is present)
initTelegramBot();

// API Routes
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
    security: 'Helmet + RateLimiter + FraudGuard active',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to EarnCashIO API',
    version: '1.0.0'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global Error Handler to prevent process crashes
app.use((err, req, res, next) => {
  console.error('💥 [Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [EarnCashIO Server] running on http://localhost:${PORT}`);
});
