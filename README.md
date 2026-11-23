# 🚀 NexusFlow Studio • Omnichannel DM & Comment Automation

> **The 100% Free, Anti-Ban Certified, Self-Hosted Social Automation & Conversion Platform.**  
> Built from scratch with an ultra-premium studio aesthetic, official Meta Graph API v21.0 compliance, up to 10 customizable trigger keywords, humanized response pacing, and real-time conversion analytics.

---

## 🌟 Why NexusFlow Studio? (Zero-Suspension Guarantee)

Social media platforms (especially **Instagram** and **Facebook**) frequently suspend accounts that use unofficial private APIs, undocumented mobile scrapers, or bot-like behavior (instant repetitive replies).

**NexusFlow eliminates account risk completely through 5 architectural pillars:**

1. **100% Official Meta Graph API v21.0 Integration**:
   - Built exclusively on official Meta Webhooks and sanctioned Cloud API endpoints (`instagram_manage_comments`, `instagram_manage_messages`, `pages_messaging`).
   - Uses encrypted App Secret Proof signing and official Meta webhook verification handshakes (`hub.challenge`).
2. **Adaptive Human Jitter Delays (Anti-Detection Pacing)**:
   - Configurable randomized delays (e.g. 4.0s to 14.0s) with microsecond variance, mimicking authentic human interaction rather than automated robot speed.
3. **Sliding-Window Token Bucket Rate Limiting**:
   - Enforces strict safe hourly limits (e.g., max 45 DMs/hr) and daily caps, keeping your account well beneath Meta's spam-detection thresholds.
4. **Spintax Fingerprint Scrambling**:
   - Message variations using `{Hey|Hello|Hi} {name}! {Here is|I've sent you} {your free blueprint|the access guide}`. Every message is unique, preventing duplicate spam heuristics.
5. **Anti-Spam Duplicate Cooldown & Toxic Keyword Filtering**:
   - Enforces a 24-hour cooldown so commenters leaving multiple comments never receive duplicate spam DMs.
   - Negative keyword list automatically ignores bot comments, scam links, or hostile language.

---

## 🛠️ Feature Breakdown

### 🎯 1. Dynamic Trigger Engine (Up to 10 Keywords & Wildcard Any-Word)
- **Adjust up to 10 Trigger Words**: Add keywords such as `GUIDE`, `BLUEPRINT`, `SEND`, `FREE`, `VIP`, `LINK`, `START`, `ACCESS`.
- **Match Modes**:
  - `Any Trigger Word`: Matches if a comment contains any of your designated keywords.
  - `Wildcard Any Word (*)`: Triggers on *any* comment on your posts or carousels (ideal for general lead magnets or community engagement).
- **Post-Specific or Omnipresent Targeting**: Bind triggers to a specific Reel ID or apply across all active feed posts.
- **Auto-Like Comment**: Automatically likes the commenter's comment to boost algorithmic visibility in Instagram & Facebook feeds.

### 💬 2. Comment Auto-Reply & Rich DM Delivery
- **Rotating Public Comment Replies**: Cycle through multiple natural reply variations (e.g. *"Check your DMs! 🚀"*, *"Sent to your inbox! 📩"*).
- **Rich DM Cards with Action Buttons**: Direct messages sent with customized call-to-action buttons (e.g., *"Download Guide ↗"*, *"Claim VIP Ticket"*).
- **Dynamic Variable Tags**: Insert `{{username}}`, `{{name}}`, `{{post_title}}`, and `{{link}}` into your templates.

### ⏸️ 3. Instant Pausing, Stopping & Fine-Tuning Controls
- **Master Killswitch**: One-click instant pause button in the top navigation to halt all active automations instantly.
- **Per-Campaign State Controls**: Toggle any campaign between **Active**, **Paused**, and **Stopped**.
- **Fine-Tuning Controls**: Slider controls for minimum/maximum jitter, hourly action quotas, and active creator hours (e.g., 08:00 to 23:00).

### 📱 4. Interactive Studio Live Playground (Zero-Setup Simulation)
- Preview an authentic **Instagram Reel / Feed Post** and a live interactive **iPhone DM Frame**.
- Type any username and comment to watch the system:
  1. Append the comment to the live feed.
  2. Start the Anti-Ban Human Jitter countdown bar.
  3. Post the public comment reply with algorithmic like ❤️.
  4. Slide the delivered Direct Message into the iPhone frame with clickable action button.

### 📊 5. Studio-Grade Analytics & Conversion Funnel
- **KPI Metrics**: Total Comments Processed, DMs Delivered, Click-Through Conversion %, and Active Campaigns.
- **Hourly Dispatch Curve**: Custom interactive SVG area chart displaying comment vs. DM velocity.
- **6-Stage Conversion Funnel**:
  - Comments Ingested → Trigger Matched → Jitter Delay Passed → Public Auto-Reply → Private DM Delivered → Link Clicked.
- **Top Trigger Words Leaderboard**: Rank and hit-rate analysis of your top-converting keywords.
- **Platform Share Distribution**: Visual breakdown across Instagram, Facebook, Threads, etc.
- **Live Activity Audit Stream**: Real-time event log with platform and status filtering.

### 🌐 6. Omnichannel Platform Hub
Modular connectors and architecture for:
- **Instagram** (Meta Graph API v21.0)
- **Facebook Pages & Messenger** (Pages API)
- **Threads** (Meta Threads API)
- **YouTube** (YouTube Data API v3 CommentThreads)
- **X / Twitter** (Twitter API v2 Direct Messages)
- **LinkedIn** (Community Management API)
- **Reddit, Quora, Medium, Dev.to** (Modular Webhook Connectors)

---

## 🚀 Quick Start Guide

### 1. Start the Studio Server
Run inside the project root:

```bash
npm start
```

Or for development:

```bash
npm run dev
```

### 2. Access the Studio Dashboard
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Setting Up Official Meta Webhooks (Instagram & Facebook)

1. Go to the [Meta for Developers Portal](https://developers.facebook.com/) and create a **Business App**.
2. Add the **Instagram Graph API** and **Webhooks** products.
3. In Webhooks, select **Instagram** and configure the Callback URL:
   ```
   https://your-public-domain.com/api/webhooks/meta
   ```
4. Enter your Verify Token (Default: `nexus_secure_verify_token_2026` or customized in Settings).
5. Subscribe to the `comments` and `messages` fields.
6. Under App Roles, add your Instagram Professional / Facebook Page accounts for instant free, compliant testing and live automation!

---

## 📁 System Architecture

```
Dm Automation/
├── package.json               # Dependencies & execution scripts
├── server/
│   ├── index.js               # Express application, REST endpoints, Webhook listeners
│   ├── db.js                  # Persistent JSON storage for campaigns, settings, logs
│   ├── safetyShield.js        # Anti-Ban Token Bucket, Jitter & Spintax Engine
│   ├── automationEngine.js    # Trigger matching (10+ triggers, wildcard, exclusions)
│   ├── metaService.js         # Official Meta Graph API v21.0 implementation
│   ├── platformsService.js    # Multi-platform adapters (YouTube, Threads, X, LinkedIn, etc.)
│   └── data/
│       └── store.json         # Local database storage
└── public/
    ├── index.html             # Studio Master Single Page Application
    ├── css/
    │   └── style.css          # Bespoke Dark Glassmorphism, Animations, iPhone Mockups
    └── js/
        ├── app.js             # Client state manager & modal controllers
        ├── liveSimulator.js   # Real-time interactive Instagram & iPhone playground
        └── analyticsCharts.js # High-definition interactive SVG charts & conversion funnels
```

---

## 🔒 Security & Privacy

- **100% Free & Self-Hosted**: No subscription fees, no third-party cloud data harvesting.
- **Your Data Stays Yours**: API tokens and campaign analytics are stored locally on your own machine.
- **Suspension-Proof**: Adheres 100% to Meta's developer policies and rate limiting guidelines.
