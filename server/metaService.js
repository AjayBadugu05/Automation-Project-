/**
 * Official Meta Graph API v21.0 Client for Instagram & Facebook
 * 
 * 100% compliant with Meta Platform Terms of Service to prevent account bans.
 * Uses official Webhooks and Graph API endpoints.
 */

const db = require('./db');

class MetaService {
  constructor() {
    this.graphBase = 'https://graph.facebook.com/v21.0';
  }

  /**
   * Handle Webhook Verification Handshake from Meta
   * Meta sends GET request with hub.mode, hub.verify_token, and hub.challenge
   */
  verifyWebhook(query) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    const settings = db.getSettings();
    const expectedToken = settings.metaConfig.verifyToken || 'nexus_secure_verify_token_2026';

    if (mode === 'subscribe' && token === expectedToken) {
      return { success: true, challenge };
    }
    return { success: false, reason: 'Invalid or mismatched verify_token' };
  }

  /**
   * Extract standardized comment payload from Meta Webhook POST event
   */
  parseWebhookEvent(body) {
    const events = [];

    if (!body || !body.entry) return events;

    for (const entry of body.entry) {
      // 1. Instagram Comments
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'comments') {
            const val = change.value;
            events.push({
              platform: 'instagram',
              postId: val.media ? val.media.id : entry.id,
              commentId: val.id,
              commentText: val.text || '',
              userId: val.from ? val.from.id : 'unknown_user',
              userName: val.from ? val.from.username : 'Instagram User',
              userHandle: val.from ? `@${val.from.username}` : '@user',
              timestamp: val.created_time || new Date().toISOString()
            });
          }
        }
      }

      // 2. Facebook Page Feed Comments
      if (body.object === 'page' && entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'feed' && change.value.item === 'comment' && change.value.verb === 'add') {
            const val = change.value;
            events.push({
              platform: 'facebook',
              postId: val.post_id,
              commentId: val.comment_id,
              commentText: val.message || '',
              userId: val.from ? val.from.id : 'unknown_fb_user',
              userName: val.from ? val.from.name : 'Facebook User',
              userHandle: val.from ? val.from.name : 'User',
              timestamp: new Date().toISOString()
            });
          }
        }
      }
    }

    return events;
  }

  /**
   * Reply to Instagram Comment using official Graph API
   */
  async replyInstagramComment(commentId, replyText, accessToken) {
    if (!accessToken) {
      return { simulated: true, note: 'Mock mode: No page access token supplied.' };
    }

    try {
      const url = `${this.graphBase}/${commentId}/replies`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyText,
          access_token: accessToken
        })
      });
      return await res.json();
    } catch (err) {
      console.error('Meta API replyInstagramComment error:', err);
      return { error: err.message };
    }
  }

  /**
   * Send Instagram Direct Message (DM) via official Instagram Messaging API
   */
  async sendInstagramDM(recipientId, messageText, buttonText, buttonUrl, accessToken) {
    if (!accessToken) {
      return { simulated: true, note: 'Mock mode: No access token supplied.' };
    }

    try {
      const url = `${this.graphBase}/me/messages`;
      
      const payload = {
        recipient: { id: recipientId },
        message: { text: messageText },
        access_token: accessToken
      };

      // Add generic template card with button if URL is provided
      if (buttonText && buttonUrl) {
        payload.message = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: messageText.split('\n')[0] || 'Exclusive Resource',
                  subtitle: messageText.slice(0, 80),
                  buttons: [
                    {
                      type: 'web_url',
                      url: buttonUrl,
                      title: buttonText
                    }
                  ]
                }
              ]
            }
          }
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.error('Meta API sendInstagramDM error:', err);
      return { error: err.message };
    }
  }

  /**
   * Verify token validity with Meta debug endpoint
   */
  async testAccessToken(token) {
    if (!token) return { valid: false, error: 'Empty token string' };

    try {
      const res = await fetch(`${this.graphBase}/me?access_token=${token}&fields=id,name`);
      const data = await res.json();
      if (data.id) {
        return { valid: true, accountName: data.name, accountId: data.id };
      }
      return { valid: false, error: data.error ? data.error.message : 'Invalid response from Meta' };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }
}

module.exports = new MetaService();
