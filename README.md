# EarnCashIO — Telegram Mini App Ad Rewards Platform

A Telegram Mini App (React frontend + Node.js backend) where users earn rewards by watching ads and referring friends. Built on Telegram's native Mini App SDK for auth/UI integration, with Adsgram / Monetag powering monetization.

---

## 🏗️ Architecture & Core Principles

- **Frontend**: React SPA (Vite) loaded inside Telegram WebView via `telegram-web-app.js`.
- **Backend**: Node.js + Express API + `grammY` Telegram Bot (Source of truth for balances, tasks, referrals, withdrawals).
- **Database**: Unified multi-engine storage (Zero-config local SQLite for development; PostgreSQL / Supabase / Neon ready for production).
- **Auth**: Telegram's signed `initData` HMAC-SHA256 verification — zero manual login, zero KYC.
- **Ad Network**: Adsgram rewarded video SDK integration with 15s cooldown and daily slot caps.
- **Languages (i18n)**: Native multi-language support (English, Amharic, Swahili, Hindi, Indonesian) with automatic Telegram language detection.
- **Security**: Strict rate limiting, FraudGuard multi-accounting & velocity heuristics, and Helmet security headers.

---

## 📱 5 Core Screens + Admin View

1. **`dashboard-view`** — Live animated balance card, daily task progress bar, quick stats, network highlights, and pull-to-refresh sync.
2. **`tasks-view`** — **5-Column × 20-Row (100 Slots) Matrix Grid** with interactive watch flow, checkmark states, and cooldown countdown timer.
3. **`referral-view`** — 1-click referral link copy, direct Telegram share button, commission tracking (+$0.05/ref), and live invited friends list.
4. **`withdraw-view`** — Country selector (🇪🇹 Ethiopia Telebirr/CBE vs 🌍 Global Crypto), fully functional eligibility gate (20 ads / 10 referrals), and transition to "In Queue / Pending Review" status card (**v1 note: UI-only fields — zero PII persisted**).
5. **`leaderboard-view`** — Live withdrawal activity stream and top weekly referrers leaderboard.
6. **`admin-view`** — Platform overview KPIs (users, ads, gross revenue estimate, queue count) and interactive withdrawal moderation tools (Approve/Reject).

---

## 🎯 Step-by-Step Roadmap Status

- [x] **Module 1 — Project Setup**: Monorepo folder setup, backend & frontend skeletons, `.env.example`, Git integration.
- [x] **Module 2 — Telegram Auth**: `initData` HMAC-SHA256 backend verification middleware & user session handshake.
- [x] **Module 3 — Database & User Model**: SQLite (zero-config local dev) + PostgreSQL ready; users, ad_watches, referrals, withdrawals schemas & auto-registration.
- [x] **Module 4 — Frontend Shell (5 Views + Admin)**: Dashboard, Tasks (100 slots), Refer, Withdraw, Leaderboard with Telegram theme and `WebApp.expand()`.
- [x] **Module 5 — Ad SDK Integration**: Adsgram SDK adapter, interactive watch flow, cooldown enforcement (15s), and daily slot reset.
- [x] **Module 6 — Dashboard Live Data**: Real backend stats integration with in-memory TTL caching layer.
- [x] **Module 7 — Referral System**: Deep-link generation (`?start=ref_USERID`), attribution, and bonus credit logic.
- [x] **Module 8 — Withdraw (v1 Placeholder)**: Eligibility gate (20 ads / 10 refs), UI-only payment selector, and status flip to pending/in queue (zero PII stored).
- [x] **Module 9 — Leaderboard**: JSON-based withdrawal activity feed stream & top earners rankings.
- [x] **Module 10 — Admin**: Telegram ID check against `ADMIN_IDS`, withdrawal queue moderation, and platform stats.
- [x] **Module 11 — Hardening**: Rate limiting (`express-rate-limit`), anti-fraud heuristics (`fraudGuard`), velocity checks, and `helmet` security.
- [x] **i18n Enhancement**: 5-Language support (English, Amharic, Swahili, Hindi, Indonesian) with 1-tap switcher.
- [ ] **Module 12 — Deployment**: Free hosting deployment (Vercel + Render + Supabase/Neon), keep-alive ping, production Adsgram Block ID.
- [ ] **Module 13 — Promotion**: Launch copy, Telegram channels/groups, directory submissions.
