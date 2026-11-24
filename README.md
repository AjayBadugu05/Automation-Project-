# <p align="center"><img src="public/assets/doraemon.svg" width="64" height="64" alt="DoraFlow Logo" /><br>DoraFlow Enterprise • Spatial Automation Studio</p>

<p align="center">
  <strong>The Ultra-Premium, Zero-Suspension Omnichannel Social DM & Comment Automation Platform</strong><br>
  Designed with Apple Liquid Glass Spatial OS (Dual-Theme Light & Dark), Hardware Token Encryption, and Meta Graph API v21.0 Private Replies Architecture.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Production%20Tests-10%2F10%20Passed-10b981?style=for-the-badge&logo=checkmarx" alt="10/10 Tests Passed" />
  <img src="https://img.shields.io/badge/Security%20Grade-A%2B%20Enterprise-3b82f6?style=for-the-badge&logo=auth0" alt="Security Grade A+" />
  <img src="https://img.shields.io/badge/Design-Apple%20Liquid%20Glass-0071e3?style=for-the-badge&logo=apple" alt="Apple Liquid Glass" />
  <img src="https://img.shields.io/badge/Meta%20API-v21.0%20Compliant-0668e1?style=for-the-badge&logo=meta" alt="Meta API v21.0" />
  <img src="https://img.shields.io/badge/Networks-10%20Connected-8b5cf6?style=for-the-badge" alt="10 Networks" />
</p>

---

## 💎 Overview

**DoraFlow Enterprise** is an industry-grade, self-hosted social media conversion platform built from the ground up for agencies, creator brands, and enterprise teams. It completely replaces fragile bot scrapers and suspicious headless automations with **100% official Meta Graph API v21.0 webhooks**, **cryptographic token security**, and **humanized delivery pacing**.

Designed following the visual aesthetics of **Apple Liquid Glass** and spatial interfaces, DoraFlow delivers seamless transitions between **Apple Spatial Dark Mode** and **Apple Studio Light Mode**, featuring full multi-tenant workspace isolation, granular 1-click version rollbacks, and interactive live feed simulators.

---

## 🛡️ Anti-Suspension & Cryptographic Security Architecture

Social media platforms (especially Instagram and Facebook) aggressively penalize accounts using unofficial scrapers, non-standard private APIs, or repetitive robotic response loops. DoraFlow guarantees account safety through 5 architectural pillars:

### 1. AES-256-GCM Hardware Token Encryption
All connected platform tokens (Meta Graph, X API v2, YouTube, LinkedIn) are encrypted at rest using **AES-256-GCM** (Galois/Counter Mode) with unique 96-bit initialization vectors (IV) and 128-bit authentication tags. Any physical database tampering renders tokens completely undecryptable.

### 2. Meta Constant-Time HMAC-SHA256 Verification
Incoming webhook dispatches from Meta are cryptographically signed with `X-Hub-Signature-256`. The payload buffer is verified in constant time via `crypto.timingSafeEqual()`, completely eliminating timing side-channel attack vectors.

### 3. Meta Graph API `appsecret_proof` Token Hijacking Guard
Every outbound Graph API request computes a dynamic SHA-256 proof:
$$\text{appsecret\_proof} = \text{HMAC-SHA256}(\text{access\_token}, \text{app\_secret})$$
Even if an OAuth token is intercepted in transit, it cannot be replayed from unauthorized external servers or IP ranges.

### 4. Meta 7-Day Private Replies Policy Enforcement
Enforces strict compliance with [Meta's Official Private Replies Policy](https://developers.facebook.com/documentation/instagram-platform/private-replies):
* Comments older than **7 days (604,800 seconds)** are automatically blocked from automated DM dispatch (`WINDOW_EXPIRED`).
* Users leaving multiple comments receive a single DM within a 24-hour window (`DUPLICATE_TRIGGER`), eliminating spam penalties.

### 5. Adaptive Human Jitter & Sliding-Window Token Bucket
* **Configurable Randomized Jitter:** Configurable delays (e.g. 2.5s – 7.5s) with millisecond-level entropy simulate authentic creator response patterns.
* **Sliding-Window Rate Limiting:** Enforces strict hourly limits (e.g., maximum 45 DMs/hr) to stay well below platform spam thresholds.
* **Zero Watermarks:** 100% white-label messages with zero vendor footers, tracking redirects, or forced branding.

---

## ⚡ Key Feature Modules

### 🎯 1. Omnichannel Rule Engine & Precedence Routing
* **Hierarchy:** Post-specific rules take explicit precedence over account-wide fallback rules.
* **Match Precision:** Supports `whole_word` (e.g., matching `"GUIDE"` while rejecting `"MisGUIDEd"`), exact phrase matching, case/punctuation sanitization, and wildcard (`*`) catch-all.
* **Safety Negative Exclusions:** Filters hostile language, spam indicators, or refund queries to abort DM delivery immediately.
* **🚀 Push-to-All Omnichannel Replication:** Deploy one rule across all 10 connected networks (Instagram, Facebook, Threads, YouTube, X/Twitter, LinkedIn, Reddit, Quora, Medium, Dev.to) in a single click.

### ⏸️ 2. Granular Controls & 1-Click Rollback
* **Master Emergency Killswitch:** Instantly halt all active outgoing dispatches.
* **Granular Pausing:** Pause individual keyword groups or campaigns without dropping queued webhooks. Resuming never replays missed comments.
* **Version History & Rollback:** Every modification logs user role, timestamp, and diffs, allowing instant 1-click rollback to any previous version.

### 👥 3. Multi-Tenant Workspaces & Human Agent Takeover
* **Strict Client Isolation:** Partitions accounts, rules, templates, and analytics across isolated workspaces (e.g., Apex Brands, Velocity Media, Creator Studio).
* **Role-Based Access Control (RBAC):** Granular permissions for `Owner`, `Admin`, `Editor`, `Approver`, and `Inbox Agent`.
* **Human Agent Takeover Silencing:** When an agent responds manually in the shared inbox, automated bot responses are muted instantly to prevent double-replies.

### 📱 4. Interactive Spatial Live Simulator
* Preview comments on authentic **Instagram Reels / Feed Posts** alongside a live interactive **Apple iPhone DM Frame**.
* Watch real-time keyword detection, jitter countdown animations, public comment replies with auto-likes ❤️, and rich private DM delivery.

---

## 🧪 10-Point Enterprise Production Verification Suite

DoraFlow includes a built-in automated verification test suite executing 10 tests across all operational boundaries:

| # | Test Module | Assertion Target | Result |
| :---: | :--- | :--- | :---: |
| **1** | **Routing & Priority Precedence** | Post-specific scope overrides account-wide fallback | **PASSED ✓** |
| **2** | **Granular Pause & 1-Click Rollback** | Paused state stops sends; zero replay on resume; version rollback | **PASSED ✓** |
| **3** | **Meta 7-Day Window & Deduplication** | Rejects comments >7 days old; deduplicates repeated triggers | **PASSED ✓** |
| **4** | **Multi-Tenant Workspace & Client Isolation**| Boundary isolation between workspaces; human takeover silencing | **PASSED ✓** |
| **5** | **Anti-Ban Sliding Limiter & White-Label** | Safe randomized jitter pacing; 0 forced vendor branding | **PASSED ✓** |
| **6** | **Google OAuth 2.0 & OIDC Identity** | Validates Google OIDC issuer, JWT claims, and CSRF nonces | **PASSED ✓** |
| **7** | **AES-256-GCM Hardware Token Encryption** | Hardware cipher encryption/decryption with 96-bit IV & 128-bit Auth Tag | **PASSED ✓** |
| **8** | **Meta HMAC-SHA256 & `appsecret_proof`** | Constant-time webhook verification; 256-bit token hijacking guard | **PASSED ✓** |
| **9** | **Keyword Match Precision Engine** | Whole-word boundaries, phrase detection, punctuation stripping | **PASSED ✓** |
| **10** | **Safety Negative Keywords Interceptor** | Drops automations on scam, bot, or negative exclusion terms | **PASSED ✓** |

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher

### Installation & Launch

```bash
# Clone the repository
git clone https://github.com/AjayBadugu05/Automation-Project-.git
cd Automation-Project-

# Install lightweight dependencies
npm install

# Start the enterprise studio server
npm start
```

For live development:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🌐 Connected Social Media Ecosystem

DoraFlow Enterprise includes native integrations and modular adapters for:
* **Instagram** (Meta Graph API v21.0 — Reels, Feed Posts, Stories & DMs)
* **Facebook** (Pages Messaging API & Post Comments)
* **Threads** (Meta Threads Webhooks & Reply Engine)
* **YouTube** (YouTube Data API v3 CommentThreads)
* **X / Twitter** (Twitter API v2 Direct Messages & Mentions)
* **LinkedIn** (Community Management API & Company Pages)
* **Reddit, Quora, Medium, Dev.to** (Enterprise Webhook & Feed Connectors)

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
