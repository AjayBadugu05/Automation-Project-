/**
 * NexusFlow Interactive Studio Live Playground
 * Real-time Instagram & Facebook Post simulation and iPhone DM delivery visualizer.
 */

class LiveSimulator {
  constructor() {
    this.postCommentsList = document.getElementById('simPostCommentsList');
    this.dmContainer = document.getElementById('simDmMessagesContainer');
    this.jitterBar = document.getElementById('simJitterTimerBar');
    this.jitterCountdown = document.getElementById('simJitterCountdown');
    this.btnSimulate = document.getElementById('btnRunSimulation');
    this.inputUser = document.getElementById('simInputUsername');
    this.inputComment = document.getElementById('simInputComment');
    this.selectPlatform = document.getElementById('simSelectPlatform');
    this.selectPost = document.getElementById('simSelectPost');

    this.initEvents();
  }

  initEvents() {
    if (this.btnSimulate) {
      this.btnSimulate.addEventListener('click', () => this.runSimulation());
    }

    if (this.inputComment) {
      this.inputComment.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.runSimulation();
      });
    }
  }

  async runSimulation() {
    const username = this.inputUser ? this.inputUser.value.trim() : '@growth_seeker';
    const comment = this.inputComment ? this.inputComment.value.trim() : 'GUIDE please!';
    const platform = this.selectPlatform ? this.selectPlatform.value : 'instagram';
    const postId = this.selectPost ? this.selectPost.value : 'reel_984710293';

    if (!comment) {
      window.app?.showToast('Please type a comment to test!', 'error');
      return;
    }

    // 1. Render User Comment immediately in Feed Mockup
    this.appendUserComment(username, comment);

    // Disable button during active processing
    this.btnSimulate.disabled = true;
    this.btnSimulate.innerHTML = `<span class="spinner"></span> Processing Rule...`;

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          postId,
          userName: username.replace('@', ''),
          userHandle: username.startsWith('@') ? username : `@${username}`,
          commentText: comment
        })
      });

      const res = await response.json();

      if (!res.success) {
        this.btnSimulate.disabled = false;
        this.btnSimulate.innerText = '⚡ Fire Test Trigger';
        window.app?.showToast(res.reason || 'Trigger ignored by Safety Rules', 'error');

        if (res.status === 'excluded') {
          this.appendSystemNotice(`⚠️ Comment filtered: ${res.reason}`);
        } else if (res.status === 'cooldown') {
          this.appendSystemNotice(`⏳ User in cooldown window. Duplicate DM prevented.`);
        }
        return;
      }

      // 2. Display Human Jitter Delay Countdown
      const jitterSec = res.jitterSeconds || 5.2;
      this.startJitterCountdown(jitterSec, () => {
        // 3. Post Public Auto-Reply in Comment Thread
        if (res.publicReply) {
          this.appendPublicReply(res.publicReply, res.autoLiked);
        }

        // 4. Deliver Direct Message into iPhone Frame
        this.deliverIPhoneDM(res.fullDm, res.buttonText, res.buttonUrl);

        this.btnSimulate.disabled = false;
        this.btnSimulate.innerText = '⚡ Fire Test Trigger';
        window.app?.showToast(`DM dispatched via Anti-Ban Shield (${jitterSec}s delay)!`, 'success');

        // Refresh analytics and logs stream
        window.app?.loadDashboardData();
      });

    } catch (err) {
      console.error('Simulation error:', err);
      this.btnSimulate.disabled = false;
      this.btnSimulate.innerText = '⚡ Fire Test Trigger';
      window.app?.showToast('Simulation failed: ' + err.message, 'error');
    }
  }

  appendUserComment(username, text) {
    if (!this.postCommentsList) return;
    const div = document.createElement('div');
    div.className = 'mock-comment-bubble';
    div.innerHTML = `
      <div style="display: flex; align-items: flex-start; justify-content: space-between;">
        <div>
          <strong>${username}</strong> ${this.escapeHtml(text)}
        </div>
        <span style="font-size: 0.68rem; color: #64748b;">Just now</span>
      </div>
    `;
    this.postCommentsList.appendChild(div);
    this.postCommentsList.scrollTop = this.postCommentsList.scrollHeight;
  }

  appendPublicReply(replyText, autoLiked) {
    if (!this.postCommentsList) return;
    const div = document.createElement('div');
    div.className = 'mock-reply-bubble';
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
        <span style="font-weight: 700; color: #a5b4fc; font-size: 0.76rem;">@growth.creator</span>
        <span class="status-badge success" style="font-size: 0.65rem; padding: 1px 5px;">Auto-Reply</span>
        ${autoLiked ? '<span title="Auto-Liked Comment">❤️</span>' : ''}
      </div>
      <div>${this.escapeHtml(replyText)}</div>
    `;
    this.postCommentsList.appendChild(div);
    this.postCommentsList.scrollTop = this.postCommentsList.scrollHeight;
  }

  appendSystemNotice(msg) {
    if (!this.postCommentsList) return;
    const div = document.createElement('div');
    div.style.fontSize = '0.74rem';
    div.style.color = '#f87171';
    div.style.background = 'rgba(239, 68, 68, 0.1)';
    div.style.padding = '6px 10px';
    div.style.borderRadius = '6px';
    div.style.marginTop = '6px';
    div.innerText = msg;
    this.postCommentsList.appendChild(div);
  }

  startJitterCountdown(seconds, onComplete) {
    if (!this.jitterBar || !this.jitterCountdown) {
      setTimeout(onComplete, 1000);
      return;
    }

    this.jitterBar.classList.add('active');
    let remaining = seconds;
    this.jitterCountdown.innerText = remaining.toFixed(1) + 's';

    const interval = setInterval(() => {
      remaining -= 0.1;
      if (remaining <= 0) {
        clearInterval(interval);
        this.jitterBar.classList.remove('active');
        onComplete();
      } else {
        this.jitterCountdown.innerText = remaining.toFixed(1) + 's';
      }
    }, 100);
  }

  deliverIPhoneDM(messageText, buttonText, buttonUrl) {
    if (!this.dmContainer) return;

    const bubble = document.createElement('div');
    bubble.className = 'dm-bubble-sent';
    
    let btnHtml = '';
    if (buttonText && buttonUrl) {
      btnHtml = `<a href="${buttonUrl}" target="_blank" class="dm-card-button">${this.escapeHtml(buttonText)} ↗</a>`;
    }

    bubble.innerHTML = `
      <div>${this.escapeHtml(messageText)}</div>
      ${btnHtml}
      <div style="font-size: 0.65rem; text-align: right; opacity: 0.7; margin-top: 6px;">Delivered • Anti-Ban Safe</div>
    `;

    this.dmContainer.appendChild(bubble);
    this.dmContainer.scrollTop = this.dmContainer.scrollHeight;
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.liveSimulator = new LiveSimulator();
