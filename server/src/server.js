import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
dotenv.config(); // fallback to local .env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check endpoint (also used by keep-alive pings)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'EarnCashIO Backend',
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
