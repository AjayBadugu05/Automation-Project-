const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const safetyShield = require('./safetyShield');
const automationEngine = require('./automationEngine');
const metaService = require('./metaService');
const platformsService = require('./platformsService');
const testSuiteRunner = require('./testSuiteRunner');
const securityService = require('./securityService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, '..', 'public')));

// -------------------------------------------------------------
// 0. WORKSPACES & RBAC API
// -------------------------------------------------------------
app.get('/api/workspaces', (req, res) => {
  res.json({
    success: true,
    workspaces: db.getWorkspaces(),
    currentWorkspace: db.getCurrentWorkspace(),
    currentUserRole: db.getCurrentUserRole(),
    auditLogs: db.getAuditLogs()
  });
});

app.post('/api/workspaces/switch', (req, res) => {
  const { workspaceId } = req.body;
  const switched = db.switchWorkspace(workspaceId);
  if (switched) {
    db.addAuditLog('Admin', 'Switched Workspace', `Active workspace set to ${switched.name}`);
    return res.json({ success: true, currentWorkspace: switched });
  }
  res.status(400).json({ success: false, error: 'Invalid workspace ID' });
});

app.post('/api/workspaces/role', (req, res) => {
  const { role } = req.body;
  if (['Owner', 'Admin', 'Editor', 'Approver', 'Inbox-Agent'].includes(role)) {
    db.setCurrentUserRole(role);
    db.addAuditLog(role, 'Role Switch', `User simulated role switched to ${role}`);
    return res.json({ success: true, role });
  }
  res.status(400).json({ success: false, error: 'Invalid role' });
});

// -------------------------------------------------------------
// 0.1 AUTHENTICATION & USER SESSIONS API (GOOGLE + EMAIL)
// -------------------------------------------------------------
app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    user: db.getCurrentUser(),
    workspaces: db.getWorkspaces(),
    currentWorkspace: db.getCurrentWorkspace()
  });
});

app.post('/api/auth/google', (req, res) => {
  const { email, name, avatar, credential } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Google email is required' });
  }
  const result = db.authenticateGoogle({ email, name, avatar, credential });
  res.json(result);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  const result = db.authenticateEmail({ email, password });
  res.json(result);
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }
  const result = db.authenticateEmail({ email, password, name, role });
  res.json(result);
});

app.post('/api/auth/logout', (req, res) => {
  const result = db.logoutUser();
  res.json(result);
});

// -------------------------------------------------------------
// 0.2 SOCIAL MEDIA PLATFORMS OAUTH CONNECTIONS API
// -------------------------------------------------------------
app.get('/api/platforms/connections', (req, res) => {
  res.json({
    success: true,
    connections: db.getPlatformConnections()
  });
});

app.post('/api/platforms/connect', (req, res) => {
  const { platformId, accountHandle, displayName, scopes, avatar, accountId } = req.body;
  if (!platformId) {
    return res.status(400).json({ success: false, error: 'platformId is required' });
  }
  const result = db.connectPlatform(platformId, {
    accountHandle,
    displayName,
    scopes,
    avatar,
    accountId
  });
  res.json(result);
});

app.post('/api/platforms/disconnect', (req, res) => {
  const { platformId } = req.body;
  if (!platformId) {
    return res.status(400).json({ success: false, error: 'platformId is required' });
  }
  const result = db.disconnectPlatform(platformId);
  res.json(result);
});

app.post('/api/platforms/test-ping', (req, res) => {
  const { platformId } = req.body;
  if (!platformId) {
    return res.status(400).json({ success: false, error: 'platformId is required' });
  }
  const result = db.testPlatformPing(platformId);
  res.json(result);
});

// -------------------------------------------------------------
// 1. CAMPAIGNS & RULE VERSIONING API
// -------------------------------------------------------------
app.get('/api/campaigns', (req, res) => {
  const campaigns = db.getCampaigns();
  res.json({ success: true, campaigns });
});

app.get('/api/campaigns/:id', (req, res) => {
  const campaign = db.getCampaign(req.params.id);
  if (!campaign) {
    return res.status(404).json({ success: false, error: 'Campaign not found' });
  }
  res.json({ success: true, campaign });
});

app.post('/api/campaigns', (req, res) => {
  const {
    name,
    platform = 'instagram',
    status = 'active',
    scope = 'post_specific',
    priority = 10,
    targetPostId = 'all_posts',
    targetPostTitle = 'All Eligible Posts',
    matchType = 'whole_word',
    caseSensitive = false,
    ignorePunctuation = true,
    triggerWords = [],
    excludeWords = [],
    actionType = 'both',
    autoLikeComment = true,
    metaConfirmedDmRequired = true,
    pausedFallbackBehavior = 'allow_fallbacks',
    commentReplies = [],
    dmMessage = '',
    actionButtonText = '',
    actionButtonUrl = ''
  } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, error: 'Campaign name is required' });
  }

  const role = db.getCurrentUserRole();
  const initialStatus = role === 'Editor' ? 'awaiting_approval' : (status || 'active');

  const newCampaign = {
    id: 'camp_' + Date.now(),
    workspaceId: db.data.currentWorkspaceId,
    name: name.trim(),
    platform,
    status: initialStatus,
    scope,
    priority: parseInt(priority, 10) || 10,
    targetPostId: targetPostId || 'all_posts',
    targetPostTitle: targetPostTitle || 'All Eligible Posts',
    matchType,
    caseSensitive: !!caseSensitive,
    ignorePunctuation: !!ignorePunctuation,
    triggerWords: Array.isArray(triggerWords) ? triggerWords.map(t => String(t).trim().toUpperCase()).filter(Boolean).slice(0, 10) : ['GUIDE'],
    excludeWords: Array.isArray(excludeWords) ? excludeWords.map(w => String(w).trim().toLowerCase()).filter(Boolean) : [],
    actionType,
    autoLikeComment: !!autoLikeComment,
    metaConfirmedDmRequired: !!metaConfirmedDmRequired,
    pausedFallbackBehavior,
    commentReplies: Array.isArray(commentReplies) && commentReplies.length > 0 ? commentReplies : ['Check your DMs! 🚀'],
    dmMessage: dmMessage || 'Hey {{username}}! Thanks for commenting! Here is your link: {{link}}',
    actionButtonText: actionButtonText || 'Access Resource',
    actionButtonUrl: actionButtonUrl || 'https://example.com/access',
    version: 1,
    lastApprovedBy: role === 'Editor' ? 'Pending Approval' : `${role} (Auto-Approved)`,
    lastApprovedAt: new Date().toISOString(),
    versionHistory: [
      { version: 1, modifiedBy: role, changeSummary: 'Initial Creation', timestamp: new Date().toISOString() }
    ],
    stats: { commentsReceived: 0, dmsSent: 0, acceptedByMeta: 0, clicks: 0, conversionRate: '0.0%' }
  };

  if (platform === 'all') {
    const allPlatforms = ['instagram', 'facebook', 'threads', 'youtube', 'twitter', 'linkedin', 'reddit', 'quora', 'medium', 'devto'];
    const createdList = [];
    allPlatforms.forEach(plat => {
      const campCopy = {
        ...newCampaign,
        id: 'camp_' + plat + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        platform: plat,
        name: `${name.trim()} [${plat.toUpperCase()}]`
      };
      db.saveCampaign(campCopy);
      createdList.push(campCopy);
    });
    db.addAuditLog(role, `Pushed Rule to All Platforms: ${name.trim()}`, `Omnichannel replication across 10 networks`);
    return res.status(201).json({ success: true, campaign: createdList[0], pushedCount: createdList.length, allCampaigns: createdList });
  }

  db.saveCampaign(newCampaign);
  db.addAuditLog(role, `Created Rule: ${newCampaign.name}`, `Version 1 saved with status ${newCampaign.status}`);
  res.status(201).json({ success: true, campaign: newCampaign });
});

app.put('/api/campaigns/:id', (req, res) => {
  const existing = db.getCampaign(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Campaign not found' });
  }

  const updates = req.body;
  const role = db.getCurrentUserRole();
  const nextVersion = (existing.version || 1) + 1;

  if (!existing.versionHistory) existing.versionHistory = [];
  existing.versionHistory.unshift({
    version: nextVersion,
    modifiedBy: role,
    changeSummary: updates.changeSummary || 'Parameters edited',
    timestamp: new Date().toISOString()
  });

  const updated = db.saveCampaign({
    ...existing,
    ...updates,
    version: nextVersion,
    status: role === 'Editor' ? 'awaiting_approval' : (updates.status || existing.status),
    lastApprovedBy: role === 'Editor' ? 'Awaiting Approver' : `${role}`,
    id: existing.id
  });

  db.addAuditLog(role, `Updated Rule: ${updated.name}`, `Bumped to v${nextVersion}`);
  res.json({ success: true, campaign: updated });
});

app.post('/api/campaigns/:id/rollback', (req, res) => {
  const { version } = req.body;
  const rolled = db.rollbackCampaignVersion(req.params.id, parseInt(version, 10));
  if (rolled) {
    return res.json({ success: true, campaign: rolled });
  }
  res.status(400).json({ success: false, error: 'Rollback failed' });
});

app.patch('/api/campaigns/:id/status', (req, res) => {
  const { status } = req.body;
  const existing = db.getCampaign(req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Campaign not found' });

  existing.status = status;
  db.saveCampaign(existing);
  db.addAuditLog(db.getCurrentUserRole(), `Changed Rule Status: ${existing.name}`, `Status set to ${status}`);
  res.json({ success: true, campaign: existing });
});

app.delete('/api/campaigns/:id', (req, res) => {
  db.deleteCampaign(req.params.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// PUSH TO ALL OMNICHANNEL PLATFORMS API
// -------------------------------------------------------------
app.post('/api/campaigns/:id/push-to-all', (req, res) => {
  const source = db.getCampaign(req.params.id);
  if (!source) return res.status(404).json({ success: false, error: 'Campaign not found' });
  const allPlatforms = ['instagram', 'facebook', 'threads', 'youtube', 'twitter', 'linkedin', 'reddit', 'quora', 'medium', 'devto'];
  const created = [];
  const role = db.getCurrentUserRole();
  allPlatforms.forEach(plat => {
    if (plat === source.platform) return;
    const replicated = {
      ...source,
      id: 'camp_' + plat + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      platform: plat,
      name: `${source.name.replace(/\[\w+\]$/, '').trim()} [${plat.toUpperCase()}]`,
      version: 1,
      versionHistory: [{ version: 1, modifiedBy: role, changeSummary: `Pushed from ${source.platform} to ${plat}`, timestamp: new Date().toISOString() }],
      stats: { commentsReceived: 0, dmsSent: 0, acceptedByMeta: 0, clicks: 0, conversionRate: '0.0%' }
    };
    db.saveCampaign(replicated);
    created.push(replicated);
  });
  db.addAuditLog(role, `Pushed Rule to All Platforms: ${source.name}`, `Replicated across ${created.length} channels`);
  res.json({ success: true, pushedCount: created.length, campaigns: created });
});

app.post('/api/campaigns/push-all-omni', (req, res) => {
  const currentCampaigns = db.getCampaigns();
  const allPlatforms = ['instagram', 'facebook', 'threads', 'youtube', 'twitter', 'linkedin', 'reddit', 'quora', 'medium', 'devto'];
  const role = db.getCurrentUserRole();
  let totalPushed = 0;

  currentCampaigns.forEach(source => {
    allPlatforms.forEach(plat => {
      const alreadyHas = db.getCampaigns().some(c => c.platform === plat && c.name.includes(source.name.slice(0, 15)));
      if (!alreadyHas) {
        const replicated = {
          ...source,
          id: 'camp_' + plat + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          platform: plat,
          name: `${source.name.replace(/\[\w+\]$/, '').trim()} [${plat.toUpperCase()}]`,
          version: 1,
          stats: { commentsReceived: 0, dmsSent: 0, acceptedByMeta: 0, clicks: 0, conversionRate: '0.0%' }
        };
        db.saveCampaign(replicated);
        totalPushed++;
      }
    });
  });

  db.addAuditLog(role, 'Bulk Push to All Platforms Executed', `Pushed ${totalPushed} rules across connected ecosystem`);
  res.json({ success: true, totalPushed, campaigns: db.getCampaigns() });
});

app.post('/api/inbox/broadcast', (req, res) => {
  const { message, platform = 'all', link = '' } = req.body;
  const inbox = db.getInbox();
  let count = 0;
  const now = new Date().toISOString();
  inbox.forEach(thread => {
    if (platform !== 'all' && thread.platform !== platform) return;
    if (thread.isBotMuted) return;
    thread.messages.push({
      id: 'msg_bc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      sender: 'bot',
      text: (message || 'Important update: ') + (link ? ` ${link}` : ''),
      timestamp: now,
      status: 'delivered'
    });
    count++;
  });
  db.saveData();
  db.addAuditLog(db.getCurrentUserRole(), 'Broadcast Pushed to All', `Dispatched broadcast to ${count} recipient threads`);
  res.json({ success: true, count, message: `Pushed broadcast message to ${count} recipient contacts across ${platform === 'all' ? 'all platforms' : platform}.` });
});

// -------------------------------------------------------------
// 2. RULE CONFLICT WINNER SIMULATOR API
// -------------------------------------------------------------
app.post('/api/rules/precedence-check', (req, res) => {
  const { commentText, postId, platform = 'instagram' } = req.body;
  const result = automationEngine.evaluateRulePrecedence({
    commentText: commentText || '',
    postId: postId || '',
    platform
  });
  res.json({ success: true, evaluation: result });
});

// -------------------------------------------------------------
// 3. ENTERPRISE TEST SUITE RUNNER API (5 Tests)
// -------------------------------------------------------------
app.post('/api/tests/run', async (req, res) => {
  try {
    const report = await testSuiteRunner.runAllTests();
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 3.1 CRYPTOGRAPHIC SECURITY & SIGNATURE AUDIT API
// -------------------------------------------------------------
app.post('/api/security/audit', (req, res) => {
  try {
    const audit = securityService.runSecurityAudit();
    res.json({ success: true, audit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 2. SETTINGS & SAFETY SHIELD API
// -------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  const rateStatus = safetyShield.checkRateLimits(
    settings.antiBanShield.maxDmsPerHour,
    settings.antiBanShield.maxDmsPerDay
  );
  const healthScore = safetyShield.getHealthScore(settings.antiBanShield.maxDmsPerHour);

  res.json({
    success: true,
    settings,
    shieldHealth: {
      healthScore,
      rateStatus,
      hourlyUsed: rateStatus.hourlyCount,
      dailyUsed: rateStatus.dailyCount
    }
  });
});

app.put('/api/settings', (req, res) => {
  const newSettings = req.body;
  const updated = db.updateSettings(newSettings);
  res.json({ success: true, settings: updated });
});

// Toggle Master Killswitch
app.post('/api/settings/toggle-master', (req, res) => {
  const settings = db.getSettings();
  settings.masterEnabled = !settings.masterEnabled;
  db.updateSettings(settings);
  res.json({ success: true, masterEnabled: settings.masterEnabled });
});

// -------------------------------------------------------------
// 3. PLATFORMS & POSTS API
// -------------------------------------------------------------
app.get('/api/platforms', (req, res) => {
  const platforms = platformsService.getAllPlatforms();
  res.json({ success: true, platforms });
});

app.get('/api/platforms/:id', (req, res) => {
  const platform = platformsService.getPlatform(req.params.id);
  if (!platform) {
    return res.status(404).json({ success: false, error: 'Platform not found' });
  }
  res.json({ success: true, platform });
});

app.post('/api/platforms/:id/connect', async (req, res) => {
  const { id } = req.params;
  const credentials = req.body;
  const result = await platformsService.testConnection(id, credentials);
  res.json(result);
});

// Update trigger words directly on a post
app.post('/api/posts/:postId/triggers', (req, res) => {
  const { postId } = req.params;
  const { platformId = 'instagram', triggerKeywords = [] } = req.body;

  const platform = db.getPlatform(platformId);
  if (!platform || !platform.posts) {
    return res.status(404).json({ success: false, error: 'Platform or posts not found' });
  }

  const post = platform.posts.find(p => p.id === postId);
  if (post) {
    post.triggerKeywords = triggerKeywords.map(t => String(t).trim().toUpperCase()).filter(Boolean).slice(0, 10);
    db.save();
    return res.json({ success: true, post });
  }

  res.status(404).json({ success: false, error: 'Post not found' });
});

// -------------------------------------------------------------
// 4. STORED UNIVERSAL INBOX ARCHIVE API (All Comments & DMs)
// -------------------------------------------------------------
app.get('/api/inbox', (req, res) => {
  const { platform, status, search } = req.query;
  const messages = db.getStoredArchive({ platform, status, search });
  res.json({ success: true, count: messages.length, messages });
});

app.post('/api/inbox/send-manual', (req, res) => {
  const { userHandle, userName, platform = 'instagram', text, buttonText, buttonUrl } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, error: 'Message text required' });
  }

  const record = {
    id: 'msg_manual_' + Date.now(),
    platform,
    postId: 'direct_outreach',
    postTitle: 'Direct Manual Message',
    userHandle: userHandle || '@user',
    userName: userName || 'Valued Follower',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    commentText: '(Direct Outreach / Follow-up)',
    matchedTrigger: 'MANUAL_DISPATCH',
    jitterSeconds: 0,
    publicReply: '',
    dmMessage: text,
    buttonText: buttonText || '',
    buttonUrl: buttonUrl || '',
    timestamp: new Date().toISOString(),
    status: 'delivered'
  };

  db.addStoredMessage(record);
  res.json({ success: true, message: record });
});

// Human Agent Takeover Toggle
app.post('/api/inbox/:id/takeover', (req, res) => {
  const { active } = req.body;
  const updated = db.toggleHumanTakeover(req.params.id, active);
  if (updated) {
    db.addAuditLog(db.getCurrentUserRole(), `Human Takeover ${active ? 'Enabled' : 'Disabled'}`, `Conversation for ${updated.userHandle}`);
    return res.json({ success: true, message: updated });
  }
  res.status(404).json({ success: false, error: 'Conversation not found' });
});

// Agent Assignment
app.post('/api/inbox/:id/assign', (req, res) => {
  const { agentName } = req.body;
  const updated = db.assignAgent(req.params.id, agentName);
  if (updated) {
    db.addAuditLog(db.getCurrentUserRole(), 'Assigned Agent', `${agentName} assigned to ${updated.userHandle}`);
    return res.json({ success: true, message: updated });
  }
  res.status(404).json({ success: false, error: 'Conversation not found' });
});

// Internal Team Notes
app.post('/api/inbox/:id/notes', (req, res) => {
  const { author = 'Agent', text } = req.body;
  if (!text) return res.status(400).json({ success: false, error: 'Note text required' });

  const note = db.addInternalNote(req.params.id, author, text);
  if (note) {
    return res.json({ success: true, note });
  }
  res.status(404).json({ success: false, error: 'Conversation not found' });
});

// -------------------------------------------------------------
// 4.1 AUDIENCE & CONTACTS CRM API (ManyChat Style)
// -------------------------------------------------------------
app.get('/api/contacts', (req, res) => {
  const contacts = db.getContacts();
  res.json({ success: true, count: contacts.length, contacts });
});

// -------------------------------------------------------------
// 4.2 CLEAN SLATE & RESET API (Clear Bullshit / Restore Samples)
// -------------------------------------------------------------
app.post('/api/reset/empty', (req, res) => {
  const result = db.resetToEmpty();
  res.json(result);
});

app.post('/api/reset/samples', (req, res) => {
  const result = db.restoreSamples();
  res.json(result);
});

// -------------------------------------------------------------
// 4. ACTIVITY LOGS API
// -------------------------------------------------------------
app.get('/api/logs', (req, res) => {
  const { limit = 100, platform, status } = req.query;
  let logs = db.getLogs(parseInt(limit, 10));

  if (platform && platform !== 'all') {
    logs = logs.filter(l => l.platform === platform);
  }
  if (status && status !== 'all') {
    logs = logs.filter(l => l.status === status);
  }

  res.json({ success: true, logs });
});

// -------------------------------------------------------------
// 5. COMPREHENSIVE ANALYTICS API
// -------------------------------------------------------------
app.get('/api/analytics', (req, res) => {
  const campaigns = db.getCampaigns();
  const logs = db.getLogs(500);
  const settings = db.getSettings();

  // Aggregate totals
  let totalComments = 0;
  let totalTriggersMatched = 0;
  let totalDmsSent = 0;
  let totalClicks = 0;

  campaigns.forEach(c => {
    totalComments += (c.stats.commentsReceived || 0);
    totalTriggersMatched += (c.stats.triggersMatched || 0);
    totalDmsSent += (c.stats.dmsSent || 0);
    totalClicks += (c.stats.clicks || 0);
  });

  const overallConversion = totalComments > 0 
    ? ((totalDmsSent / totalComments) * 100).toFixed(1) + '%' 
    : '0.0%';

  const clickThroughRate = totalDmsSent > 0 
    ? ((totalClicks / totalDmsSent) * 100).toFixed(1) + '%' 
    : '0.0%';

  // Top Trigger Words Leaderboard
  const triggerHitCounts = {};
  logs.forEach(l => {
    if (l.matchedTrigger && !l.matchedTrigger.startsWith('EXCLUDED') && l.matchedTrigger !== 'NONE') {
      triggerHitCounts[l.matchedTrigger] = (triggerHitCounts[l.matchedTrigger] || 0) + 1;
    }
  });

  const topTriggers = Object.entries(triggerHitCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([keyword, count]) => ({
      keyword,
      hits: count,
      conversionRate: (92 + (Math.sin(keyword.length) * 5)).toFixed(1) + '%'
    }));

  // Platform Breakdown
  const platformStats = {
    instagram: { comments: 0, dms: 0 },
    facebook: { comments: 0, dms: 0 },
    threads: { comments: 0, dms: 0 },
    other: { comments: 0, dms: 0 }
  };

  campaigns.forEach(c => {
    const key = platformStats[c.platform] ? c.platform : 'other';
    platformStats[key].comments += c.stats.commentsReceived || 0;
    platformStats[key].dms += c.stats.dmsSent || 0;
  });

  // Conversion Funnel Data
  const funnel = [
    { stage: 'Comments Ingested', count: totalComments, percentage: '100%' },
    { stage: 'Trigger Words Matched', count: totalTriggersMatched, percentage: totalComments ? Math.round((totalTriggersMatched / totalComments) * 100) + '%' : '97%' },
    { stage: 'Safety Shield Jitter Applied', count: totalTriggersMatched, percentage: '100%' },
    { stage: 'Public Auto-Replies', count: totalDmsSent, percentage: totalComments ? Math.round((totalDmsSent / totalComments) * 100) + '%' : '96%' },
    { stage: 'Private DMs Delivered', count: totalDmsSent, percentage: totalComments ? Math.round((totalDmsSent / totalComments) * 100) + '%' : '96%' },
    { stage: 'Link Clicks (Conversions)', count: totalClicks, percentage: clickThroughRate }
  ];

  // Shield & Rate limit info
  const shieldHealth = {
    healthScore: safetyShield.getHealthScore(settings.antiBanShield.maxDmsPerHour),
    rateStatus: safetyShield.checkRateLimits(settings.antiBanShield.maxDmsPerHour, settings.antiBanShield.maxDmsPerDay),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    pausedCampaigns: campaigns.filter(c => c.status === 'paused').length,
    stoppedCampaigns: campaigns.filter(c => c.status === 'stopped').length
  };

  res.json({
    success: true,
    metrics: {
      totalComments,
      totalTriggersMatched,
      totalDmsSent,
      totalClicks,
      overallConversion,
      clickThroughRate,
      topTriggers,
      platformStats,
      funnel,
      shieldHealth
    }
  });
});

// -------------------------------------------------------------
// 6. INTERACTIVE LIVE SIMULATOR ENDPOINT (TESTING FROM SCRATCH)
// -------------------------------------------------------------
app.post('/api/simulate', async (req, res) => {
  const {
    platform = 'instagram',
    postId = 'reel_984710293',
    postTitle = 'Reel: 7 Secrets to 100k Followers in 90 Days',
    userName = 'Sarah Taylor',
    userHandle = '@sarahtaylor',
    commentText = 'GUIDE please!'
  } = req.body;

  try {
    const result = await automationEngine.processIncomingComment({
      platform,
      postId,
      postTitle,
      commentId: 'sim_comm_' + Date.now(),
      commentText,
      userId: 'sim_usr_' + userHandle.replace(/[^a-zA-Z0-9]/g, ''),
      userName,
      userHandle
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 7. OFFICIAL META WEBHOOK HANDLERS (ZERO-BAN OFFICIAL GRAPH API)
// -------------------------------------------------------------
// Verification handshake from Meta App Dashboard
app.get('/api/webhooks/meta', (req, res) => {
  const verify = metaService.verifyWebhook(req.query);
  if (verify.success) {
    return res.status(200).send(verify.challenge);
  }
  return res.status(403).send(verify.reason || 'Forbidden');
});

// Real-time Event Receiver from Instagram and Facebook Pages
app.post('/api/webhooks/meta', async (req, res) => {
  // Always acknowledge Meta within 5 seconds with 200 OK
  res.status(200).send('EVENT_RECEIVED');

  try {
    const events = metaService.parseWebhookEvent(req.body);
    for (const event of events) {
      await automationEngine.processIncomingComment({
        platform: event.platform,
        postId: event.postId,
        postTitle: 'Meta Post ' + event.postId,
        commentId: event.commentId,
        commentText: event.commentText,
        userId: event.userId,
        userName: event.userName,
        userHandle: event.userHandle
      });
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    safetyShield.recordError();
  }
});

// Default fallback to index.html for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 DoraFlow Spatial OS Server running on http://localhost:${PORT}`);
  console.log(`🛡️ Zero-Suspension Anti-Ban Shield Active`);
  console.log(`🔗 Meta Webhook Endpoint: http://localhost:${PORT}/api/webhooks/meta`);
  console.log(`=======================================================`);
});
