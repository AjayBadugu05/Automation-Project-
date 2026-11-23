/**
 * NexusFlow Analytics & Data Visualization Engine
 * Renders interactive SVG activity trends, conversion funnels, and trigger rankings.
 */

class AnalyticsRenderer {
  constructor() {
    this.containerTrend = document.getElementById('chartTrendContainer');
    this.containerFunnel = document.getElementById('funnelContainer');
    this.containerTriggers = document.getElementById('topTriggersTableBody');
    this.containerPlatform = document.getElementById('platformBreakdownContainer');
  }

  renderAll(metrics) {
    if (!metrics) return;
    this.renderTrendChart();
    this.renderFunnel(metrics.funnel || []);
    this.renderTopTriggers(metrics.topTriggers || []);
    this.renderPlatformStats(metrics.platformStats || {});
  }

  /**
   * Render custom modern SVG Area Chart for Hourly Performance
   */
  renderTrendChart() {
    if (!this.containerTrend) return;

    // 12-hour simulation data points
    const points = [
      { time: '10 AM', comments: 45, dms: 42 },
      { time: '11 AM', comments: 72, dms: 68 },
      { time: '12 PM', comments: 95, dms: 91 },
      { time: '1 PM', comments: 130, dms: 126 },
      { time: '2 PM', comments: 110, dms: 105 },
      { time: '3 PM', comments: 165, dms: 158 },
      { time: '4 PM', comments: 210, dms: 204 },
      { time: '5 PM', comments: 185, dms: 180 },
      { time: '6 PM', comments: 240, dms: 232 },
      { time: '7 PM', comments: 290, dms: 281 },
      { time: '8 PM', comments: 320, dms: 312 },
      { time: '9 PM', comments: 275, dms: 268 }
    ];

    const maxVal = Math.max(...points.map(p => p.comments)) * 1.15;
    const width = 800;
    const height = 240;
    const padding = 35;

    const getX = (idx) => padding + (idx * ((width - padding * 2) / (points.length - 1)));
    const getY = (val) => height - padding - ((val / maxVal) * (height - padding * 2));

    // Construct SVG path for Comments
    const commentCoords = points.map((p, i) => `${getX(i)},${getY(p.comments)}`);
    const dmsCoords = points.map((p, i) => `${getX(i)},${getY(p.dms)}`);

    const pathComments = `M ${commentCoords.join(' L ')}`;
    const areaComments = `M ${getX(0)},${height - padding} L ${commentCoords.join(' L ')} L ${getX(points.length - 1)},${height - padding} Z`;

    const pathDms = `M ${dmsCoords.join(' L ')}`;
    const areaDms = `M ${getX(0)},${height - padding} L ${dmsCoords.join(' L ')} L ${getX(points.length - 1)},${height - padding} Z`;

    const svg = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;">
        <defs>
          <linearGradient id="gradComments" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="gradDms" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Grid Lines -->
        <line x1="${padding}" y1="${getY(maxVal * 0.25)}" x2="${width - padding}" y2="${getY(maxVal * 0.25)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${getY(maxVal * 0.5)}" x2="${width - padding}" y2="${getY(maxVal * 0.5)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
        <line x1="${padding}" y1="${getY(maxVal * 0.75)}" x2="${width - padding}" y2="${getY(maxVal * 0.75)}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>

        <!-- Filled Areas -->
        <path d="${areaComments}" fill="url(#gradComments)" />
        <path d="${areaDms}" fill="url(#gradDms)" />

        <!-- Stroke Lines -->
        <path d="${pathComments}" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" />
        <path d="${pathDms}" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" />

        <!-- Interactive Points -->
        ${points.map((p, i) => `
          <circle cx="${getX(i)}" cy="${getY(p.dms)}" r="4.5" fill="#fff" stroke="#6366f1" stroke-width="2.5">
            <title>${p.time}: ${p.dms} DMs Delivered</title>
          </circle>
          <text x="${getX(i)}" y="${height - 10}" fill="#64748b" font-size="10.5" text-anchor="middle" font-family="Inter, sans-serif">${p.time}</text>
        `).join('')}
      </svg>
    `;

    this.containerTrend.innerHTML = svg;
  }

  /**
   * Render Conversion Funnel
   */
  renderFunnel(funnelList) {
    if (!this.containerFunnel) return;

    let html = '';
    funnelList.forEach((item, index) => {
      const percentageNum = parseInt(item.percentage, 10) || (100 - index * 6);
      html += `
        <div class="funnel-row">
          <div class="funnel-label">${item.stage}</div>
          <div class="funnel-bar-wrap">
            <div class="funnel-bar-fill" style="width: ${percentageNum}%;"></div>
          </div>
          <div class="funnel-count">${item.count.toLocaleString()}</div>
        </div>
      `;
    });

    this.containerFunnel.innerHTML = html;
  }

  /**
   * Render Top Trigger Words Table
   */
  renderTopTriggers(triggers) {
    if (!this.containerTriggers) return;

    if (triggers.length === 0) {
      this.containerTriggers.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">No triggers recorded yet.</td></tr>`;
      return;
    }

    let html = '';
    triggers.forEach((t, i) => {
      html += `
        <tr>
          <td><span style="font-weight: 700; color: #818cf8;">#${i + 1}</span></td>
          <td>
            <span class="trigger-tag">${t.keyword}</span>
          </td>
          <td style="font-family: var(--font-mono); font-weight: 600;">${t.hits.toLocaleString()} hits</td>
          <td>
            <span class="status-badge success">${t.conversionRate}</span>
          </td>
        </tr>
      `;
    });

    this.containerTriggers.innerHTML = html;
  }

  /**
   * Render Platform Distribution
   */
  renderPlatformStats(stats) {
    if (!this.containerPlatform) return;

    const total = (stats.instagram?.dms || 0) + (stats.facebook?.dms || 0) + (stats.threads?.dms || 0) + 1;
    const igPct = Math.round(((stats.instagram?.dms || 0) / total) * 100);
    const fbPct = Math.round(((stats.facebook?.dms || 0) / total) * 100);
    const thPct = Math.round(((stats.threads?.dms || 0) / total) * 100);

    this.containerPlatform.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
            <span style="font-weight: 600; color: #f43f5e;">Instagram</span>
            <span style="font-family: var(--font-mono); color: #fff;">${stats.instagram?.dms || 0} DMs (${igPct}%)</span>
          </div>
          <div style="height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
            <div style="width: ${igPct}%; height: 100%; background: linear-gradient(90deg, #f09433, #e6683c, #dc2743);"></div>
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
            <span style="font-weight: 600; color: #38bdf8;">Facebook Pages</span>
            <span style="font-family: var(--font-mono); color: #fff;">${stats.facebook?.dms || 0} DMs (${fbPct}%)</span>
          </div>
          <div style="height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
            <div style="width: ${fbPct}%; height: 100%; background: #1877f2;"></div>
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
            <span style="font-weight: 600; color: #a855f7;">Threads</span>
            <span style="font-family: var(--font-mono); color: #fff;">${stats.threads?.dms || 0} DMs (${thPct}%)</span>
          </div>
          <div style="height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
            <div style="width: ${thPct}%; height: 100%; background: #8b5cf6;"></div>
          </div>
        </div>
      </div>
    `;
  }
}

window.analyticsRenderer = new AnalyticsRenderer();
