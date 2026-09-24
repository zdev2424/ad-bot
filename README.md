# EarnCashIO — Telegram Mini App Ad Rewards Platform

A Telegram Mini App (React frontend + Node.js backend) where users earn rewards by watching ads and referring friends. Built on Telegram's native Mini App SDK for auth/UI integration, with Adsgram / Monetag powering monetization.

---

## 🏗️ Architecture & Core Principles

- **Frontend**: React (Telegram Mini App loaded via `@telegram-apps/sdk` / `telegram-web-app.js` inside Telegram WebView).
- **Backend**: Node.js API (Source of truth for balances, ad-watch state, referrals, and withdrawals).
- **Telegram Bot**: `grammY` / Telegraf handling `/start`, deep-link referral params, and opening the Mini App.
- **Auth**: Telegram's signed `initData` HMAC-SHA256 validation — zero manual login, zero KYC.
- **Ad Network**: Adsgram / Monetag rewarded video SDK adapter.
- **Security & Integrity**: The frontend only renders state. Every reward-affecting action (ad watched, referral credited, withdrawal queued) is validated and written server-side.

---

## 📱 5 Core Screens + Admin View

1. **`dashboard-view`** — Stats display: ads watched, $ earned, friends invited, $ per referral, quick action shortcuts.
2. **`tasks-view`** — List of up to 100 ad slots, watch flow UI with countdowns, muted/disabled state after watching.
3. **`referral-view`** — Referral link display, 1-click copy & Telegram share, invited friends list with commission tracking.
4. **`withdraw-view`** — Country selector (Crypto globally, Telebirr/CBE + Name in Ethiopia), fully functional eligibility gate (20 ads / 10 referrals), and interactive submission that flips state to "pending / in queue" (**v1 note: UI-only fields — address/name data is never sent or persisted to backend**).
5. **`leaderboard-view`** — Recent withdrawal activity feed (JSON-based activity stream, e.g. *"Someone withdrew $4"*).
6. **`admin-view`** — Dynamic view rendering when the authenticated Telegram user ID matches an admin ID in environment variables. Includes withdrawal queue management and platform-wide analytics.

---

## 🎯 Step-by-Step Module Roadmap

- [x] **Module 1 — Project Setup**: Monorepo folder setup, backend & frontend skeletons, `.env.example`, BotFather & hosting guide.
- [x] **Module 2 — Telegram Auth**: `initData` HMAC-SHA256 backend verification middleware & user session handshake.
- [x] **Module 3 — Database & User Model**: SQLite (zero-config local dev) + PostgreSQL ready; users, ad_watches, referrals, withdrawals schemas & auto-registration.
- [x] **Module 4 — Frontend Shell (5 Views + Admin)**: Dashboard, Tasks (100 slots), Refer, Withdraw, Leaderboard with Telegram theme and `WebApp.expand()`.
- [x] **Module 5 — Ad SDK Integration**: Adsgram test Block ID, interactive watch flow, cooldown enforcement (15–20s), and daily slot reset.
- [x] **Module 6 — Dashboard Live Data**: Real backend stats integration with in-memory TTL caching layer.
- [x] **Module 7 — Referral System**: Deep-link generation (`?start=ref_USERID`), attribution, and bonus credit logic.
- [x] **Module 8 — Withdraw (v1 Placeholder)**: Eligibility gate (20 ads / 10 refs), UI-only payment selector, and status flip to pending/in queue (zero PII stored).
- [x] **Module 9 — Leaderboard**: JSON-based withdrawal activity feed stream & top earners rankings.
- [x] **Module 10 — Admin**: Telegram ID check against `ADMIN_IDS`, withdrawal queue moderation, and platform stats.
- [x] **Module 11 — Hardening**: Rate limiting (`express-rate-limit`), anti-fraud heuristics (`fraudGuard`), velocity checks, and `helmet` security.
- [ ] **Module 12 — Deployment**: Free hosting deployment (Vercel + Render + Supabase/Neon), keep-alive ping, production Adsgram Block ID.
- [ ] **Module 13 — Promotion**: Launch copy, Telegram channels/groups, directory submissions.
