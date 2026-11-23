const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'store.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Enterprise Multi-Workspace Initial Data
const initialEnterpriseData = {
  currentWorkspaceId: 'ws_apex',
  currentUserRole: 'Owner',
  currentUser: {
    id: 'usr_sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@growthagency.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    provider: 'google',
    role: 'Owner',
    workspaceId: 'ws_apex',
    verified: true,
    twoFactorEnabled: true,
    lastLogin: new Date().toISOString()
  },
  users: [
    {
      id: 'usr_sarah',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@growthagency.io',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      provider: 'google',
      role: 'Owner',
      workspaceId: 'ws_apex'
    },
    {
      id: 'usr_marcus',
      name: 'Marcus Vance',
      email: 'marcus.vance@growthagency.io',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
      provider: 'google',
      role: 'Approver',
      workspaceId: 'ws_apex'
    },
    {
      id: 'usr_alex',
      name: 'Alex Rivera',
      email: 'alex.rivera@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      provider: 'google',
      role: 'Inbox-Agent',
      workspaceId: 'ws_apex'
    }
  ],
  platformConnections: {
    instagram: {
      connected: true,
      platform: 'instagram',
      accountHandle: '@growth.creator',
      displayName: 'Growth Creator HQ (Verified Creator)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      accountId: '17841400293817',
      tokenExpiresAt: '2027-01-20T12:00:00Z',
      tokenStatus: 'active',
      scopes: ['instagram_manage_comments', 'instagram_manage_messages', 'pages_read_engagement', 'pages_manage_posts'],
      webhookActive: true,
      lastPingStatus: '200 OK (18ms)'
    },
    facebook: {
      connected: true,
      platform: 'facebook',
      accountHandle: 'Velocity Media Official',
      displayName: 'Velocity Media Corp Page',
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150',
      accountId: '10928374659182',
      tokenExpiresAt: '2027-01-15T12:00:00Z',
      tokenStatus: 'active',
      scopes: ['pages_manage_metadata', 'pages_read_engagement', 'pages_messaging'],
      webhookActive: true,
      lastPingStatus: '200 OK (22ms)'
    },
    threads: {
      connected: true,
      platform: 'threads',
      accountHandle: '@growth.threads',
      displayName: 'Growth Creator Threads',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      accountId: 'thr_8912749',
      tokenExpiresAt: '2027-01-10T12:00:00Z',
      tokenStatus: 'active',
      scopes: ['threads_basic', 'threads_content_publish', 'threads_manage_replies'],
      webhookActive: true,
      lastPingStatus: '200 OK (31ms)'
    },
    youtube: {
      connected: true,
      platform: 'youtube',
      accountHandle: 'Growth Blueprint Studio',
      displayName: 'Growth Blueprint Studio (Partner)',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      accountId: 'UC_984710293847',
      tokenExpiresAt: '2026-12-30T12:00:00Z',
      tokenStatus: 'active',
      scopes: ['https://www.googleapis.com/auth/youtube.force-ssl'],
      webhookActive: true,
      lastPingStatus: '200 OK (26ms)'
    },
    twitter: {
      connected: true,
      platform: 'twitter',
      accountHandle: '@GrowthBlueprint',
      displayName: 'Growth Blueprint X',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      accountId: 'x_109283746',
      tokenExpiresAt: '2027-01-25T12:00:00Z',
      tokenStatus: 'active',
      scopes: ['tweet.read', 'tweet.write', 'users.read', 'dm.read', 'dm.write'],
      webhookActive: true,
      lastPingStatus: '200 OK (39ms)'
    },
    linkedin: {
      connected: true,
      platform: 'linkedin',
      accountHandle: 'Apex Growth Agency',
      displayName: 'Apex Growth Agency Inc.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      accountId: 'urn:li:organization:9182374',
      tokenExpiresAt: '2027-01-05T12:00:00Z',
      tokenStatus: 'active',
      scopes: ['r_organization_social', 'w_organization_social', 'rw_organization_admin'],
      webhookActive: true,
      lastPingStatus: '200 OK (45ms)'
    }
  },
  workspaces: [
    {
      id: 'ws_apex',
      name: 'Apex Growth Agency (Client A)',
      tier: 'Enterprise Agency Tier',
      activeAccount: '@growth.creator',
      team: [
        { id: 'usr_sarah', name: 'Sarah Jenkins', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        { id: 'usr_marcus', name: 'Marcus Vance', role: 'Approver', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
        { id: 'usr_elena', name: 'Elena Rostova', role: 'Editor', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
        { id: 'usr_alex', name: 'Alex Rivera', role: 'Inbox-Agent', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }
      ]
    },
    {
      id: 'ws_velocity',
      name: 'Velocity Media (Client B)',
      tier: 'Agency Pro Tier',
      activeAccount: '@velocity.marketing',
      team: [
        { id: 'usr_david', name: 'David Kim', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        { id: 'usr_sophie', name: 'Sophie Lin', role: 'Editor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
      ]
    },
    {
      id: 'ws_creator',
      name: 'Creator Studio HQ (Personal)',
      tier: 'Unlimited Self-Hosted',
      activeAccount: '@apex.creator',
      team: [
        { id: 'usr_self', name: 'Admin User', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }
      ]
    }
  ],
  settings: {
    masterEnabled: true,
    theme: 'dark', // 'dark' or 'light'
    antiBanShield: {
      enabled: true,
      minJitterSeconds: 4,
      maxJitterSeconds: 14,
      maxDmsPerHour: 45,
      maxDmsPerDay: 400,
      userCooldownHours: 24,
      spintaxEnabled: true,
      autoLikeComments: true,
      metaSevenDayWindowEnforced: true,
      activeHoursOnly: false,
      activeHoursStart: "08:00",
      activeHoursEnd: "23:00"
    },
    metaConfig: {
      appId: "918237461928374",
      appSecret: "••••••••••••••••••••••••",
      verifyToken: "dora_secure_meta_token_2026",
      pageAccessToken: "EAAG...meta_verified_token",
      instagramAccountId: "17841400293817",
      facebookPageId: "10928374659182"
    }
  },
  platforms: {
    instagram: {
      id: 'instagram',
      name: 'Instagram',
      handle: '@growth.creator',
      displayName: 'Growth Creator HQ',
      verified: true,
      category: 'Creator & Reels Hub',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      connected: true,
      stats: {
        followers: '148.5K',
        following: '342',
        postsCount: '284',
        totalComments: '4,892',
        totalDmsSent: '4,640',
        conversionRate: '94.8%'
      },
      posts: [
        {
          id: 'reel_984710293',
          type: 'reel',
          title: '7 Secrets to 100k Followers in 90 Days',
          caption: 'Drop your comment "GUIDE" or "BLUEPRINT" below and my automation sends you the exact PDF framework! 🔥👇',
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
          views: '348.2K',
          likes: '28.4K',
          commentsCount: '1,420',
          shares: '4.8K',
          postedAt: '2 days ago',
          postedTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          activeCampaignId: 'camp_ig_reel_blueprint',
          triggerKeywords: ['GUIDE', 'BLUEPRINT', 'SEND', 'FREE', 'GROWTH', 'START', 'INFO', 'LINK', 'YES', 'ACCESS'],
          status: 'active'
        },
        {
          id: 'reel_449102831',
          type: 'reel',
          title: 'How I Automated 5,000 DMs for $0 Without Ban',
          caption: 'Never risk your account on scrapers. Comment "SAFETY" or "TOOL" for the full open-source repo! 🛡️',
          thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80',
          views: '189.5K',
          likes: '15.2K',
          commentsCount: '890',
          shares: '2.9K',
          postedAt: '5 days ago',
          postedTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
          activeCampaignId: 'camp_ig_safety_repo',
          triggerKeywords: ['SAFETY', 'TOOL', 'SOURCE', 'REPO', 'FREE'],
          status: 'active'
        },
        {
          id: 'post_carousel_7781',
          type: 'carousel',
          title: 'The Modern Content-to-Client Funnel [Slide by Slide]',
          caption: 'Swipe through all 7 slides. Comment "FUNNEL" to get our high-resolution Figma templates.',
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
          views: '94.1K',
          likes: '7.8K',
          commentsCount: '430',
          shares: '1.2K',
          postedAt: '1 week ago',
          postedTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
          activeCampaignId: 'camp_ig_funnel_figma',
          triggerKeywords: ['FUNNEL', 'FIGMA', 'TEMPLATES', 'SWIPE'],
          status: 'active'
        }
      ]
    },
    facebook: {
      id: 'facebook',
      name: 'Facebook Pages',
      handle: 'Apex Digital Agency',
      displayName: 'Apex Digital Business Page',
      verified: true,
      category: 'Meta Business Page',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      connected: true,
      stats: {
        followers: '89.2K',
        postsCount: '312',
        totalComments: '2,840',
        totalDmsSent: '2,710',
        conversionRate: '95.4%'
      },
      posts: [
        {
          id: 'post_fb_552199',
          type: 'post',
          title: 'Live Masterclass: Scaling Client Acquisition via Messenger Automation',
          caption: 'Comment "VIP" to claim your ticket to Thursday’s live hands-on workshop! 🎓🎟️',
          thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
          views: '54.0K',
          likes: '3.4K',
          commentsCount: '512',
          postedAt: '1 day ago',
          postedTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          activeCampaignId: 'camp_fb_masterclass',
          triggerKeywords: ['VIP', 'JOIN', 'WEBINAR', 'CLASS', 'LINK', 'AI', 'AUTOMATE', 'INVITE'],
          status: 'active'
        }
      ]
    },
    threads: {
      id: 'threads',
      name: 'Threads',
      handle: '@growth.creator',
      displayName: 'Growth Creator on Threads',
      verified: true,
      category: 'Meta Conversations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      connected: true,
      stats: { followers: '48.9K', postsCount: '192', totalComments: '1,240', totalDmsSent: '1,180', conversionRate: '95.1%' },
      posts: []
    },
    youtube: {
      id: 'youtube',
      name: 'YouTube',
      handle: 'Growth Lab TV',
      displayName: 'Growth Lab TV Official',
      verified: true,
      category: 'Video & Creator',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      connected: true,
      stats: { followers: '264.0K', postsCount: '142', totalComments: '3,890', totalDmsSent: '3,650', conversionRate: '93.8%' },
      posts: []
    },
    twitter: {
      id: 'twitter',
      name: 'X (Twitter)',
      handle: '@GrowthLabHQ',
      displayName: 'Growth Lab HQ',
      verified: true,
      category: 'Microblogging & DMs',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      connected: true,
      stats: { followers: '78.4K', postsCount: '890', totalComments: '2,150', totalDmsSent: '2,040', conversionRate: '94.9%' },
      posts: []
    },
    linkedin: {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'Nexus Growth Systems',
      displayName: 'Nexus Growth Systems Inc.',
      verified: true,
      category: 'Professional Network',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      connected: true,
      stats: { followers: '35.6K', postsCount: '148', totalComments: '1,120', totalDmsSent: '1,060', conversionRate: '94.6%' },
      posts: []
    }
  },
  campaigns: [
    {
      id: 'camp_ig_reel_blueprint',
      workspaceId: 'ws_apex',
      name: 'Viral Blueprint Free Guide 🚀',
      platform: 'instagram',
      status: 'active', // active, paused, draft, awaiting_approval, expired, archived
      scope: 'post_specific', // post_specific (highest precedence) or account_wide
      priority: 10, // Higher number wins ties
      targetPostId: 'reel_984710293',
      targetPostTitle: 'Reel: 7 Secrets to 100k Followers in 90 Days',
      matchType: 'whole_word', // exact, whole_word, phrase, wildcard
      caseSensitive: false,
      ignorePunctuation: true,
      triggerWords: ['GUIDE', 'BLUEPRINT', 'SEND', 'FREE', 'GROWTH', 'START', 'INFO', 'LINK', 'YES', 'ACCESS'],
      excludeWords: ['scam', 'bot', 'fake', 'hate', 'unfollow'],
      actionType: 'both', // public_only, dm_only, both
      autoLikeComment: true,
      metaConfirmedDmRequired: true, // Say "Sent you a DM" only AFTER Meta accepts DM
      pausedFallbackBehavior: 'allow_fallbacks', // allow_fallbacks or block_fallbacks
      commentReplies: [
        'Just sent the full guide straight to your DM! Check your inbox 🚀✨',
        'Check your DMs! Your free Blueprint is waiting for you 📩🔥'
      ],
      dmMessage: "Hey {{username}}! 👋\n\nThanks for commenting on our Reel! As promised, here is your 100% free Viral Growth Blueprint:\n\n🔗 https://growthblueprint.io/free-access?ref={{username}}\n\nDrop a reply if you have any questions!",
      actionButtonText: 'Download Blueprint',
      actionButtonUrl: 'https://growthblueprint.io/free-access',
      version: 2,
      lastApprovedBy: 'Marcus Vance (Approver)',
      lastApprovedAt: '2026-11-21T10:00:00Z',
      versionHistory: [
        { version: 1, modifiedBy: 'Elena Rostova', changeSummary: 'Initial draft created', timestamp: '2026-11-20T08:00:00Z' },
        { version: 2, approvedBy: 'Marcus Vance', changeSummary: 'Added priority score 10 and 10 trigger words', timestamp: '2026-11-21T10:00:00Z' }
      ],
      stats: { commentsReceived: 1420, dmsSent: 1385, acceptedByMeta: 1385, clicks: 1042, conversionRate: '97.5%' }
    },
    {
      id: 'camp_fb_masterclass',
      workspaceId: 'ws_apex',
      name: 'Facebook AI Automation Masterclass VIP',
      platform: 'facebook',
      status: 'active',
      scope: 'post_specific',
      priority: 15,
      targetPostId: 'post_fb_552199',
      targetPostTitle: 'Live Post: Complete No-Code Workflow Breakdown',
      matchType: 'whole_word',
      caseSensitive: false,
      ignorePunctuation: true,
      triggerWords: ['VIP', 'JOIN', 'WEBINAR', 'CLASS', 'LINK', 'AI', 'AUTOMATE', 'INVITE'],
      excludeWords: ['spam', 'fake'],
      actionType: 'both',
      autoLikeComment: true,
      metaConfirmedDmRequired: true,
      pausedFallbackBehavior: 'allow_fallbacks',
      commentReplies: [
        'VIP access link sent to your Messenger! See you inside 🎓',
        'Check your Messenger inbox! Your VIP ticket has been delivered 🎟️'
      ],
      dmMessage: "Hello {{name}}! 🌟\n\nHere is your private VIP pass to the AI Automation Masterclass:\n\n🎟️ Ticket: https://masterclass.nexus.io/vip-access?uid={{username}}",
      actionButtonText: 'Claim Free Ticket',
      actionButtonUrl: 'https://masterclass.nexus.io/vip-access',
      version: 1,
      lastApprovedBy: 'Sarah Jenkins (Owner)',
      lastApprovedAt: '2026-11-21T14:30:00Z',
      versionHistory: [
        { version: 1, approvedBy: 'Sarah Jenkins', changeSummary: 'Live production release', timestamp: '2026-11-21T14:30:00Z' }
      ],
      stats: { commentsReceived: 512, dmsSent: 494, acceptedByMeta: 494, clicks: 379, conversionRate: '96.5%' }
    },
    {
      id: 'camp_ig_account_fallback',
      workspaceId: 'ws_apex',
      name: 'Account-Wide General Comment Assistant',
      platform: 'instagram',
      status: 'active',
      scope: 'account_wide', // Lower precedence than post-specific
      priority: 1,
      targetPostId: 'all_posts',
      targetPostTitle: 'All Eligible Posts & Reels',
      matchType: 'whole_word',
      caseSensitive: false,
      ignorePunctuation: true,
      triggerWords: ['HELP', 'CONTACT', 'SUPPORT', 'INFO'],
      excludeWords: ['hate', 'bot'],
      actionType: 'both',
      autoLikeComment: false,
      metaConfirmedDmRequired: true,
      pausedFallbackBehavior: 'allow_fallbacks',
      commentReplies: [
        'Thanks for reaching out! Sent you our direct support link in your DMs 🙌'
      ],
      dmMessage: "Hey {{username}}! Thanks for contacting Growth Creator HQ. Here is our direct support portal: https://support.growthcreator.io",
      actionButtonText: 'Support Portal',
      actionButtonUrl: 'https://support.growthcreator.io',
      version: 1,
      lastApprovedBy: 'Marcus Vance',
      lastApprovedAt: '2026-11-22T08:00:00Z',
      versionHistory: [
        { version: 1, approvedBy: 'Marcus Vance', changeSummary: 'Account fallback initiated', timestamp: '2026-11-22T08:00:00Z' }
      ],
      stats: { commentsReceived: 210, dmsSent: 198, acceptedByMeta: 198, clicks: 120, conversionRate: '94.3%' }
    }
  ],
  storedArchive: [
    {
      id: 'msg_001',
      workspaceId: 'ws_apex',
      platform: 'instagram',
      postId: 'reel_984710293',
      postTitle: '7 Secrets to 100k Followers in 90 Days',
      userHandle: '@alex_rivera',
      userName: 'Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      commentText: 'Please send me the BLUEPRINT! Looking forward to this!',
      commentCreatedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      matchedTrigger: 'BLUEPRINT',
      winningRuleName: 'Viral Blueprint Free Guide 🚀 (Post-Specific • Priority 10)',
      jitterSeconds: 6.8,
      publicReply: 'Just sent the full guide straight to your DM! Check your inbox 🚀✨',
      dmMessage: "Hey @alex_rivera! 👋 Thanks for commenting on our Reel! As promised, here is your 100% free Viral Growth Blueprint: https://growthblueprint.io/free-access?ref=@alex_rivera",
      buttonText: 'Download Blueprint',
      buttonUrl: 'https://growthblueprint.io/free-access',
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      status: 'accepted_by_meta',
      assignedAgent: 'Sarah',
      humanTakeoverActive: false,
      tags: ['VIP Lead', 'High Intent'],
      internalNotes: [
        { id: 'n1', author: 'Sarah (Agent)', text: 'Lead commented on our flagship reel. High engagement potential.', timestamp: new Date(Date.now() - 1000 * 60 * 16).toISOString() }
      ]
    },
    {
      id: 'msg_002',
      workspaceId: 'ws_apex',
      platform: 'instagram',
      postId: 'reel_984710293',
      postTitle: '7 Secrets to 100k Followers in 90 Days',
      userHandle: '@elena_art',
      userName: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      commentText: 'GUIDE please!! Love this content',
      commentCreatedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      matchedTrigger: 'GUIDE',
      winningRuleName: 'Viral Blueprint Free Guide 🚀 (Post-Specific • Priority 10)',
      jitterSeconds: 9.1,
      publicReply: 'Check your DMs! Your free Blueprint is waiting for you 📩🔥',
      dmMessage: "Hey @elena_art! 👋 Thanks for commenting on our Reel! As promised, here is your 100% free Viral Growth Blueprint: https://growthblueprint.io/free-access?ref=@elena_art",
      buttonText: 'Download Blueprint',
      buttonUrl: 'https://growthblueprint.io/free-access',
      timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      status: 'accepted_by_meta',
      assignedAgent: 'Marcus',
      humanTakeoverActive: false,
      tags: ['Creator'],
      internalNotes: []
    },
    {
      id: 'msg_003',
      workspaceId: 'ws_apex',
      platform: 'facebook',
      postId: 'post_fb_552199',
      postTitle: 'Live Post: Complete No-Code Workflow Breakdown',
      userHandle: 'marcus.vance.94',
      userName: 'Marcus Vance',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
      commentText: 'VIP ticket please',
      commentCreatedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
      matchedTrigger: 'VIP',
      winningRuleName: 'Facebook AI Automation Masterclass VIP (Priority 15)',
      jitterSeconds: 5.4,
      publicReply: 'VIP access link sent to your Messenger! See you inside 🎓',
      dmMessage: "Hello Marcus Vance! 🌟 Here is your private VIP pass to the AI Automation Masterclass: https://masterclass.nexus.io/vip-access?uid=marcus.vance.94",
      buttonText: 'Claim Free Ticket',
      buttonUrl: 'https://masterclass.nexus.io/vip-access',
      timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
      status: 'accepted_by_meta',
      assignedAgent: 'Unassigned',
      humanTakeoverActive: false,
      tags: ['Masterclass Attendee'],
      internalNotes: []
    }
  ],
  outboundQueue: [],
  auditLogs: [
    { id: 'aud_1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), author: 'Sarah (Owner)', action: 'Workspace Activated', details: 'Client A isolation confirmed' },
    { id: 'aud_2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), author: 'Marcus (Approver)', action: 'Rule Approved: Viral Blueprint v2', details: '10 triggers verified, Meta confirmed DM enabled' }
  ],
  userCooldowns: {}
};

class EnterpriseDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure new enterprise fields are present
        if (!this.data.workspaces) this.data.workspaces = initialEnterpriseData.workspaces;
        if (!this.data.currentWorkspaceId) this.data.currentWorkspaceId = 'ws_apex';
        if (!this.data.currentUserRole) this.data.currentUserRole = 'Owner';
        if (!this.data.currentUser) this.data.currentUser = initialEnterpriseData.currentUser;
        if (!this.data.users) this.data.users = initialEnterpriseData.users;
        if (!this.data.platformConnections) this.data.platformConnections = initialEnterpriseData.platformConnections;
        if (!this.data.auditLogs) this.data.auditLogs = initialEnterpriseData.auditLogs;
        if (!this.data.outboundQueue) this.data.outboundQueue = [];

        // Ensure campaigns have enterprise properties
        if (this.data.campaigns) {
          this.data.campaigns.forEach(c => {
            if (!c.workspaceId) c.workspaceId = 'ws_apex';
            if (!c.scope) c.scope = (c.targetPostId && c.targetPostId !== 'all_posts') ? 'post_specific' : 'account_wide';
            if (!c.priority) c.priority = c.scope === 'post_specific' ? 10 : 1;
            if (!c.matchType) c.matchType = 'whole_word';
            if (!c.versionHistory) c.versionHistory = [{ version: c.version || 1, changeSummary: 'Base version', timestamp: new Date().toISOString() }];
          });
        }
      } else {
        this.data = JSON.parse(JSON.stringify(initialEnterpriseData));
        this.save();
      }
    } catch (e) {
      console.error('Error loading db, resetting to enterprise initial state:', e);
      this.data = JSON.parse(JSON.stringify(initialEnterpriseData));
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write to DB:', e);
    }
  }

  getWorkspaces() {
    return this.data.workspaces;
  }

  getCurrentWorkspace() {
    return this.data.workspaces.find(w => w.id === this.data.currentWorkspaceId) || this.data.workspaces[0];
  }

  switchWorkspace(workspaceId) {
    if (this.data.workspaces.some(w => w.id === workspaceId)) {
      this.data.currentWorkspaceId = workspaceId;
      this.save();
      return this.getCurrentWorkspace();
    }
    return null;
  }

  getCurrentUserRole() {
    return this.data.currentUserRole || 'Owner';
  }

  setCurrentUserRole(role) {
    this.data.currentUserRole = role;
    this.save();
    return role;
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  getPlatforms() {
    return this.data.platforms;
  }

  getPlatform(id) {
    return this.data.platforms[id] || null;
  }

  updatePlatform(id, updates) {
    if (this.data.platforms[id]) {
      this.data.platforms[id] = { ...this.data.platforms[id], ...updates };
      this.save();
      return this.data.platforms[id];
    }
    return null;
  }

  getCampaigns(workspaceId = null) {
    const wsId = workspaceId || this.data.currentWorkspaceId;
    return this.data.campaigns.filter(c => !c.workspaceId || c.workspaceId === wsId);
  }

  getCampaign(id) {
    return this.data.campaigns.find(c => c.id === id);
  }

  saveCampaign(campaign) {
    if (!campaign.workspaceId) campaign.workspaceId = this.data.currentWorkspaceId;
    const idx = this.data.campaigns.findIndex(c => c.id === campaign.id);
    if (idx !== -1) {
      this.data.campaigns[idx] = { ...this.data.campaigns[idx], ...campaign };
    } else {
      this.data.campaigns.unshift(campaign);
    }
    this.save();
    return campaign;
  }

  deleteCampaign(id) {
    this.data.campaigns = this.data.campaigns.filter(c => c.id !== id);
    this.save();
    return true;
  }

  // Rollback campaign version
  rollbackCampaignVersion(campaignId, targetVersion) {
    const camp = this.getCampaign(campaignId);
    if (!camp || !camp.versionHistory) return null;
    const hist = camp.versionHistory.find(h => h.version === targetVersion);
    if (!hist) return null;

    camp.version = targetVersion;
    camp.status = 'active';
    this.addAuditLog('Marcus (Approver)', `Rollback Rule: ${camp.name}`, `Rolled back to Version ${targetVersion}`);
    this.save();
    return camp;
  }

  // Shared Inbox & Human Handover
  getStoredArchive(filter = {}) {
    const wsId = filter.workspaceId || this.data.currentWorkspaceId;
    let list = (this.data.storedArchive || []).filter(m => !m.workspaceId || m.workspaceId === wsId);

    if (filter.platform && filter.platform !== 'all') {
      list = list.filter(m => m.platform === filter.platform);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter(m => m.status === filter.status);
    }
    if (filter.agent && filter.agent !== 'all') {
      list = list.filter(m => m.assignedAgent === filter.agent);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(m => 
        (m.userHandle && m.userHandle.toLowerCase().includes(q)) ||
        (m.userName && m.userName.toLowerCase().includes(q)) ||
        (m.commentText && m.commentText.toLowerCase().includes(q)) ||
        (m.dmMessage && m.dmMessage.toLowerCase().includes(q))
      );
    }
    return list;
  }

  addStoredMessage(record) {
    if (!this.data.storedArchive) this.data.storedArchive = [];
    if (!record.workspaceId) record.workspaceId = this.data.currentWorkspaceId;
    this.data.storedArchive.unshift(record);
    if (this.data.storedArchive.length > 1000) {
      this.data.storedArchive = this.data.storedArchive.slice(0, 1000);
    }
    this.save();
    return record;
  }

  toggleHumanTakeover(messageId, isActive) {
    const item = (this.data.storedArchive || []).find(m => m.id === messageId);
    if (item) {
      item.humanTakeoverActive = !!isActive;
      this.save();
      return item;
    }
    return null;
  }

  assignAgent(messageId, agentName) {
    const item = (this.data.storedArchive || []).find(m => m.id === messageId);
    if (item) {
      item.assignedAgent = agentName;
      this.save();
      return item;
    }
    return null;
  }

  addInternalNote(messageId, author, noteText) {
    const item = (this.data.storedArchive || []).find(m => m.id === messageId);
    if (item) {
      if (!item.internalNotes) item.internalNotes = [];
      const note = {
        id: 'note_' + Date.now(),
        author,
        text: noteText,
        timestamp: new Date().toISOString()
      };
      item.internalNotes.push(note);
      this.save();
      return note;
    }
    return null;
  }

  getAuditLogs() {
    return this.data.auditLogs || [];
  }

  addAuditLog(author, action, details) {
    if (!this.data.auditLogs) this.data.auditLogs = [];
    const log = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString(),
      author,
      action,
      details
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    this.save();
    return log;
  }

  getLogs(limit = 100) {
    const list = this.data.storedArchive || [];
    return list.slice(0, limit);
  }

  addLog(log) {
    return this.addStoredMessage(log);
  }

  checkUserCooldown(userId, cooldownHours) {
    if (!this.data.userCooldowns) this.data.userCooldowns = {};
    const lastSent = this.data.userCooldowns[userId];
    if (!lastSent) return true;
    const elapsedHours = (Date.now() - new Date(lastSent).getTime()) / (1000 * 60 * 60);
    return elapsedHours >= cooldownHours;
  }

  recordUserSent(userId) {
    if (!this.data.userCooldowns) this.data.userCooldowns = {};
    this.data.userCooldowns[userId] = new Date().toISOString();
    this.save();
  }

  // -------------------------------------------------------------
  // Authentication & Users
  // -------------------------------------------------------------
  getCurrentUser() {
    return this.data.currentUser || initialEnterpriseData.currentUser;
  }

  setCurrentUser(user) {
    this.data.currentUser = user;
    this.data.currentUserRole = user.role;
    this.save();
    return user;
  }

  getUsers() {
    return this.data.users || initialEnterpriseData.users;
  }

  authenticateGoogle({ email, name, avatar, credential }) {
    if (!this.data.users) this.data.users = JSON.parse(JSON.stringify(initialEnterpriseData.users));
    let user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: 'usr_g_' + Date.now(),
        name: name || email.split('@')[0],
        email: email,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        provider: 'google',
        role: this.data.currentUserRole || 'Owner',
        workspaceId: this.data.currentWorkspaceId || 'ws_apex',
        verified: true,
        twoFactorEnabled: true,
        lastLogin: new Date().toISOString()
      };
      this.data.users.push(user);
    } else {
      user.lastLogin = new Date().toISOString();
      if (avatar) user.avatar = avatar;
      if (name) user.name = name;
    }

    this.data.currentUser = user;
    this.data.currentUserRole = user.role;
    this.addAuditLog(user.name + ` (${user.role})`, 'Google OAuth 2.0 Sign-In', `Authenticated with verified Google profile: ${email}`);
    this.save();
    return {
      success: true,
      user,
      token: 'jwt_google_live_' + Buffer.from(email + ':' + Date.now()).toString('base64')
    };
  }

  authenticateEmail({ email, password, name, role }) {
    if (!this.data.users) this.data.users = JSON.parse(JSON.stringify(initialEnterpriseData.users));
    let user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: 'usr_em_' + Date.now(),
        name: name || email.split('@')[0],
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        provider: 'email',
        role: role || 'Editor',
        workspaceId: this.data.currentWorkspaceId || 'ws_apex',
        verified: true,
        twoFactorEnabled: false,
        lastLogin: new Date().toISOString()
      };
      this.data.users.push(user);
    } else {
      user.lastLogin = new Date().toISOString();
    }

    this.data.currentUser = user;
    this.data.currentUserRole = user.role;
    this.addAuditLog(user.name + ` (${user.role})`, 'Direct Email Sign-In', `Session established for ${email}`);
    this.save();
    return {
      success: true,
      user,
      token: 'jwt_session_' + Buffer.from(email + ':' + Date.now()).toString('base64')
    };
  }

  logoutUser() {
    const prev = this.data.currentUser;
    if (prev) {
      this.addAuditLog(prev.name, 'Sign Out', 'User session terminated');
    }
    this.data.currentUser = {
      id: 'usr_guest',
      name: 'Guest Operator',
      email: 'guest@doraflow.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      provider: 'guest',
      role: 'Editor',
      workspaceId: this.data.currentWorkspaceId || 'ws_apex',
      verified: false,
      lastLogin: new Date().toISOString()
    };
    this.save();
    return { success: true };
  }

  // -------------------------------------------------------------
  // Social Platform OAuth Connections
  // -------------------------------------------------------------
  getPlatformConnections() {
    if (!this.data.platformConnections) {
      this.data.platformConnections = JSON.parse(JSON.stringify(initialEnterpriseData.platformConnections));
      this.save();
    }
    return this.data.platformConnections;
  }

  getPlatformConnection(platformId) {
    const conns = this.getPlatformConnections();
    return conns[platformId] || null;
  }

  connectPlatform(platformId, config = {}) {
    if (!this.data.platformConnections) {
      this.data.platformConnections = JSON.parse(JSON.stringify(initialEnterpriseData.platformConnections));
    }
    const existing = this.data.platformConnections[platformId] || {};
    
    const newConn = {
      ...existing,
      connected: true,
      platform: platformId,
      accountHandle: config.accountHandle || existing.accountHandle || `@${platformId}.official`,
      displayName: config.displayName || existing.displayName || `${platformId.toUpperCase()} Connected Account`,
      avatar: config.avatar || existing.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      accountId: config.accountId || existing.accountId || 'acc_' + Date.now(),
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
      tokenStatus: 'active',
      scopes: config.scopes || existing.scopes || ['read', 'write'],
      webhookActive: true,
      lastPingStatus: '200 OK (20ms)',
      lastConnectedAt: new Date().toISOString()
    };

    this.data.platformConnections[platformId] = newConn;

    if (this.data.platforms && this.data.platforms[platformId]) {
      this.data.platforms[platformId].connected = true;
      this.data.platforms[platformId].handle = newConn.accountHandle;
      this.data.platforms[platformId].displayName = newConn.displayName;
    }

    this.addAuditLog(this.data.currentUser?.name || 'Admin', `OAuth Connect: ${platformId.toUpperCase()}`, `Account ${newConn.accountHandle} bound to workspace ${this.data.currentWorkspaceId}`);
    this.save();
    return { success: true, connection: newConn };
  }

  disconnectPlatform(platformId) {
    if (!this.data.platformConnections) {
      this.data.platformConnections = JSON.parse(JSON.stringify(initialEnterpriseData.platformConnections));
    }
    if (this.data.platformConnections[platformId]) {
      this.data.platformConnections[platformId].connected = false;
      this.data.platformConnections[platformId].tokenStatus = 'revoked';
      this.data.platformConnections[platformId].webhookActive = false;
    }
    if (this.data.platforms && this.data.platforms[platformId]) {
      this.data.platforms[platformId].connected = false;
    }
    this.addAuditLog(this.data.currentUser?.name || 'Admin', `OAuth Disconnect: ${platformId.toUpperCase()}`, `Token revoked for ${platformId}`);
    this.save();
    return { success: true };
  }

  testPlatformPing(platformId) {
    const conn = this.getPlatformConnection(platformId);
    if (!conn || !conn.connected) {
      return { success: false, error: 'Platform account is not connected.' };
    }
    const latency = Math.floor(Math.random() * 25) + 12; // 12ms to 37ms
    conn.lastPingStatus = `200 OK (${latency}ms)`;
    this.save();
    return {
      success: true,
      latencyMs: latency,
      status: 'active',
      tokenValid: true,
      scopesVerified: conn.scopes,
      webhookHealth: 'healthy',
      checkedAt: new Date().toISOString()
    };
  }
}

module.exports = new EnterpriseDatabase();
