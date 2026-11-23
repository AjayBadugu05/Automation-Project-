/**
 * NexusFlow Zero-Suspension Anti-Ban Safety Shield
 * 
 * Protects social media accounts from automated spam detection,
 * rate limit breaches, and account restrictions.
 */

class SafetyShield {
  constructor() {
    this.hourlyActions = [];
    this.dailyActions = [];
    this.errorCount = 0;
  }

  /**
   * Process Spintax formatting: {Option A|Option B|Option C}
   * Requires at least one '|' so template variables like {{username}} or {name} are preserved.
   */
  resolveSpintax(text) {
    if (!text) return '';
    const spintaxRegex = /\{([^{}]+?\|[^{}]+?)\}/g;
    let result = text;
    while (spintaxRegex.test(result)) {
      result = result.replace(spintaxRegex, (match, choices) => {
        const options = choices.split('|');
        const picked = options[Math.floor(Math.random() * options.length)];
        return picked.trim();
      });
    }
    return result;
  }

  /**
   * Generate human-like random jitter delay (e.g., 5.3 seconds)
   */
  calculateJitter(minSeconds = 4, maxSeconds = 14) {
    const min = Math.max(1, minSeconds);
    const max = Math.max(min, maxSeconds);
    const jitter = Math.random() * (max - min) + min;
    return parseFloat(jitter.toFixed(2));
  }

  /**
   * Check whether current time is within active hours (if enabled)
   */
  isWithinActiveHours(startTime = "08:00", endTime = "23:00") {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    return currentMinutes >= startTotal && currentMinutes <= endTotal;
  }

  /**
   * Check sliding window rate limits (Hourly & Daily caps)
   */
  checkRateLimits(maxPerHour = 45, maxPerDay = 400) {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    // Clean old records
    this.hourlyActions = this.hourlyActions.filter(ts => ts > oneHourAgo);
    this.dailyActions = this.dailyActions.filter(ts => ts > oneDayAgo);

    const hourlyCount = this.hourlyActions.length;
    const dailyCount = this.dailyActions.length;

    const allowed = hourlyCount < maxPerHour && dailyCount < maxPerDay;

    return {
      allowed,
      hourlyCount,
      dailyCount,
      maxPerHour,
      maxPerDay,
      hourlyPercentage: Math.min(100, Math.round((hourlyCount / maxPerHour) * 100)),
      dailyPercentage: Math.min(100, Math.round((dailyCount / maxPerDay) * 100)),
      reason: !allowed 
        ? (hourlyCount >= maxPerHour ? 'Hourly rate limit threshold reached' : 'Daily safety volume cap reached')
        : 'Safe'
    };
  }

  /**
   * Record action in token buckets
   */
  recordAction() {
    const now = Date.now();
    this.hourlyActions.push(now);
    this.dailyActions.push(now);
  }

  /**
   * Calculate overall Account Safety & Health score (0% - 100%)
   */
  getHealthScore(maxPerHour = 45) {
    const { hourlyCount } = this.checkRateLimits(maxPerHour);
    let score = 100;

    // Deduct points based on velocity load
    const loadFactor = hourlyCount / maxPerHour;
    if (loadFactor > 0.8) {
      score -= 25;
    } else if (loadFactor > 0.6) {
      score -= 10;
    }

    // Deduct if any errors occurred
    score -= Math.min(30, this.errorCount * 10);

    return Math.max(15, Math.min(100, score));
  }

  recordError() {
    this.errorCount++;
    setTimeout(() => {
      this.errorCount = Math.max(0, this.errorCount - 1);
    }, 10 * 60 * 1000); // Decays over 10 min
  }
}

module.exports = new SafetyShield();
