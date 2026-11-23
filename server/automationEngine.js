const db = require('./db');
const safetyShield = require('./safetyShield');

class EnterpriseAutomationEngine {
  /**
   * Match precision engine: handles whole_word, phrase, and exact matches.
   */
  isTriggerMatched(commentText = '', triggerWords = [], matchType = 'whole_word', options = {}) {
    if (!commentText || !triggerWords) return false;
    const caseSensitive = options.caseSensitive || false;
    const ignorePunctuation = options.ignorePunctuation ?? true;

    let targetText = commentText.trim();
    if (!caseSensitive) targetText = targetText.toLowerCase();
    if (ignorePunctuation) targetText = targetText.replace(/[^\w\s]/gi, ' ');

    const triggers = Array.isArray(triggerWords) ? triggerWords : [triggerWords];
    for (const rawKw of triggers) {
      const kw = rawKw.trim();
      if (!kw) continue;
      if (kw === '*') return true;

      let searchKw = kw;
      if (!caseSensitive) searchKw = searchKw.toLowerCase();
      if (ignorePunctuation) searchKw = searchKw.replace(/[^\w\s]/gi, ' ');
      searchKw = searchKw.trim();

      if (matchType === 'exact') {
        if (targetText.trim() === searchKw) return true;
      } else if (matchType === 'phrase') {
        if (targetText.includes(searchKw)) return true;
      } else {
        // whole_word
        const escaped = searchKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, caseSensitive ? '' : 'i');
        if (regex.test(targetText)) return true;
      }
    }
    return false;
  }

  /**
   * Evaluate which rule wins before or during execution.
   * Scope hierarchy: post_specific > account_wide
   * Tie-breaker: numerical priority (higher wins)
   */
  evaluateRulePrecedence({
    commentText = '',
    postId = '',
    platform = 'instagram',
    workspaceId = null
  }) {
    const campaigns = db.getCampaigns(workspaceId).filter(c => c.platform === platform);
    const cleanComment = commentText.trim();
    const candidateMatches = [];

    for (const camp of campaigns) {
      // Only active rules participate in live execution
      if (camp.status !== 'active') continue;

      // 1. Post Scope Matching
      const isPostSpecific = (camp.scope === 'post_specific' || (!camp.scope && camp.targetPostId && camp.targetPostId !== 'all_posts')) && camp.targetPostId === postId;
      const isAccountWide = camp.scope === 'account_wide' || camp.targetPostId === 'all_posts' || !camp.targetPostId;

      if (!isPostSpecific && !isAccountWide) continue;

      // 2. Negative/Exclusion words check
      let hasExclusion = false;
      let hitExclusionWord = '';
      if (camp.excludeWords && camp.excludeWords.length > 0) {
        for (const rawEx of camp.excludeWords) {
          const ex = camp.caseSensitive ? rawEx.trim() : rawEx.trim().toLowerCase();
          const target = camp.caseSensitive ? cleanComment : cleanComment.toLowerCase();
          if (ex && target.includes(ex)) {
            hasExclusion = true;
            hitExclusionWord = rawEx.trim();
            break;
          }
        }
      }

      if (hasExclusion) {
        candidateMatches.push({
          campaign: camp,
          isExcluded: true,
          excludedWord: hitExclusionWord,
          matchedKeyword: null,
          scopeScore: isPostSpecific ? 200 : 100,
          priorityScore: camp.priority || 1,
          totalScore: -1
        });
        continue;
      }

      // 3. Match Trigger Words according to matchType
      let triggerMatched = false;
      let matchedKeyword = '';

      if (camp.matchType === 'wildcard' || (camp.triggerWords && camp.triggerWords.includes('*'))) {
        triggerMatched = true;
        matchedKeyword = '* (Wildcard Any Word)';
      } else {
        const triggers = camp.triggerWords || [];
        for (const rawKw of triggers) {
          const kw = rawKw.trim();
          if (!kw) continue;

          let targetText = cleanComment;
          let searchKw = kw;

          if (!camp.caseSensitive) {
            targetText = targetText.toLowerCase();
            searchKw = searchKw.toLowerCase();
          }

          if (camp.ignorePunctuation) {
            targetText = targetText.replace(/[^\w\s]/gi, '');
            searchKw = searchKw.replace(/[^\w\s]/gi, '');
          }

          if (camp.matchType === 'exact') {
            if (targetText.trim() === searchKw.trim()) {
              triggerMatched = true;
              matchedKeyword = kw;
              break;
            }
          } else if (camp.matchType === 'phrase') {
            if (targetText.includes(searchKw)) {
              triggerMatched = true;
              matchedKeyword = kw;
              break;
            }
          } else {
            // Default: whole_word
            const regex = new RegExp(`\\b${searchKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, camp.caseSensitive ? '' : 'i');
            if (regex.test(targetText)) {
              triggerMatched = true;
              matchedKeyword = kw;
              break;
            }
          }
        }
      }

      if (triggerMatched) {
        const scopeScore = isPostSpecific ? 200 : 100;
        const priorityScore = parseInt(camp.priority || 1, 10);
        candidateMatches.push({
          campaign: camp,
          isExcluded: false,
          matchedKeyword,
          scopeScore,
          priorityScore,
          totalScore: scopeScore + priorityScore
        });
      }
    }

    // Sort candidates by total score descending
    candidateMatches.sort((a, b) => b.totalScore - a.totalScore);

    const winningCandidate = candidateMatches.find(c => !c.isExcluded && c.totalScore > 0);

    return {
      candidatesCount: candidateMatches.length,
      allCandidates: candidateMatches,
      winner: winningCandidate ? winningCandidate.campaign : null,
      matchedKeyword: winningCandidate ? winningCandidate.matchedKeyword : null,
      winReason: winningCandidate
        ? `Won via ${winningCandidate.campaign.scope.toUpperCase()} scope (Score: ${winningCandidate.totalScore}, Priority: ${winningCandidate.priorityScore})`
        : (candidateMatches.some(c => c.isExcluded) ? 'Blocked by negative exclusion keyword' : 'No rule matched')
    };
  }

  /**
   * Main Process Entry with 7-Day Meta Private Replies Window & Human Takeover Guards
   */
  async processIncomingComment({
    platform = 'instagram',
    postId = '',
    postTitle = 'Social Media Post',
    commentId = 'comm_' + Date.now(),
    commentText = '',
    commentCreatedAt = new Date().toISOString(),
    userId = 'user_' + Date.now(),
    userName = 'Valued User',
    userHandle = '@user',
    workspaceId = null
  }) {
    const settings = db.getSettings();

    // 1. Check Master Switch
    if (!settings.masterEnabled) {
      return { success: false, status: 'aborted', reason: 'Master automation killswitch paused.' };
    }

    // 2. Safeguard: Skip account's own comments
    const platformDef = db.getPlatform(platform);
    if (platformDef && platformDef.handle && platformDef.handle.toLowerCase() === userHandle.toLowerCase()) {
      return { success: false, status: 'self_comment_skipped', reason: 'Skipped comment from account itself.' };
    }

    // 3. Meta 7-Day Private Replies Rule Check (Official Meta Developer Policy)
    if (settings.antiBanShield?.metaSevenDayWindowEnforced !== false) {
      const commentAgeHours = (Date.now() - new Date(commentCreatedAt).getTime()) / (1000 * 60 * 60);
      if (commentAgeHours > 168) { // 7 days = 168 hours
        return {
          success: false,
          status: 'expired_meta_window',
          reason: `Meta Private Reply Rule: Comment is older than 7 days (${commentAgeHours.toFixed(1)}h). Direct message blocked by platform policy.`
        };
      }
    }

    // 4. Check Human Agent Takeover for this user
    const existingThreads = db.getStoredArchive({ workspaceId, search: userHandle });
    const hasTakeover = existingThreads.some(t => t.humanTakeoverActive);
    if (hasTakeover) {
      return {
        success: false,
        status: 'human_takeover_active',
        reason: `Human Agent Handover Active for ${userHandle}. Automated bot reply silenced.`
      };
    }

    // 5. Evaluate Rule Precedence & Winner
    const evaluation = this.evaluateRulePrecedence({
      commentText,
      postId,
      platform,
      workspaceId
    });

    if (!evaluation.winner) {
      return {
        success: false,
        status: evaluation.winReason.includes('exclusion') ? 'excluded' : 'no_trigger_match',
        reason: evaluation.winReason
      };
    }

    const matchedCampaign = evaluation.winner;
    const matchedKeyword = evaluation.matchedKeyword;

    // 6. Check User Duplicate Cooldown
    const shieldCfg = settings.antiBanShield;
    const cooldownHours = shieldCfg.userCooldownHours || 24;
    const isAllowed = db.checkUserCooldown(userId, cooldownHours);
    if (!isAllowed) {
      return {
        success: false,
        status: 'cooldown',
        reason: `User ${userHandle} messaged within cooldown window (${cooldownHours}h).`
      };
    }

    // 7. Check Sliding-Window Rate Limits
    const rateCheck = safetyShield.checkRateLimits(shieldCfg.maxDmsPerHour, shieldCfg.maxDmsPerDay);
    if (!rateCheck.allowed) {
      safetyShield.recordError();
      return {
        success: false,
        status: 'rate_limited',
        reason: `Anti-Ban Shield: ${rateCheck.reason}`
      };
    }

    // 8. Human Jitter Pacing
    const jitterSec = safetyShield.calculateJitter(shieldCfg.minJitterSeconds, shieldCfg.maxJitterSeconds);

    // 9. Format Outgoing DM
    let rawDm = matchedCampaign.dmMessage || 'Hey {{username}}! Thanks for commenting! Here is your link: {{link}}';
    let formattedDm = safetyShield.resolveSpintax(rawDm)
      .replace(/\{{1,2}username\}{1,2}/gi, userHandle)
      .replace(/\{{1,2}name\}{1,2}/gi, userName)
      .replace(/\{{1,2}post_title\}{1,2}/gi, postTitle)
      .replace(/\{{1,2}link\}{1,2}/gi, matchedCampaign.actionButtonUrl || '');

    // 10. Format Public Comment Reply (Only if allowed & accepted)
    let chosenPublicReply = '';
    if (matchedCampaign.actionType !== 'dm_only' && matchedCampaign.commentReplies?.length > 0) {
      const idx = Math.floor(Math.random() * matchedCampaign.commentReplies.length);
      chosenPublicReply = safetyShield.resolveSpintax(matchedCampaign.commentReplies[idx])
        .replace(/\{{1,2}username\}{1,2}/gi, userHandle)
        .replace(/\{{1,2}name\}{1,2}/gi, userName);
    }

    // 11. Record Action & Store in Archive
    safetyShield.recordAction();
    db.recordUserSent(userId);

    // Update campaign metrics
    matchedCampaign.stats = matchedCampaign.stats || {};
    matchedCampaign.stats.commentsReceived = (matchedCampaign.stats.commentsReceived || 0) + 1;
    matchedCampaign.stats.dmsSent = (matchedCampaign.stats.dmsSent || 0) + 1;
    matchedCampaign.stats.acceptedByMeta = (matchedCampaign.stats.acceptedByMeta || 0) + 1;
    db.saveCampaign(matchedCampaign);

    const archiveRecord = {
      id: 'msg_' + Date.now(),
      workspaceId: workspaceId || db.data.currentWorkspaceId,
      platform,
      postId,
      postTitle,
      userHandle,
      userName,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      commentText,
      commentCreatedAt,
      matchedTrigger: matchedKeyword,
      winningRuleName: `${matchedCampaign.name} (${matchedCampaign.scope} • Priority ${matchedCampaign.priority})`,
      jitterSeconds: jitterSec,
      publicReply: chosenPublicReply,
      dmMessage: formattedDm,
      buttonText: matchedCampaign.actionButtonText,
      buttonUrl: matchedCampaign.actionButtonUrl,
      timestamp: new Date().toISOString(),
      status: 'accepted_by_meta',
      assignedAgent: 'Unassigned',
      humanTakeoverActive: false,
      tags: ['Automated Lead'],
      internalNotes: []
    };
    db.addStoredMessage(archiveRecord);

    return {
      success: true,
      status: 'accepted_by_meta',
      jitterSeconds: jitterSec,
      campaign: matchedCampaign.name,
      scope: matchedCampaign.scope,
      priority: matchedCampaign.priority,
      matchedKeyword,
      publicReply: chosenPublicReply,
      fullDm: formattedDm,
      buttonText: matchedCampaign.actionButtonText,
      buttonUrl: matchedCampaign.actionButtonUrl,
      metaConfirmed: true,
      log: archiveRecord
    };
  }
}

module.exports = new EnterpriseAutomationEngine();
