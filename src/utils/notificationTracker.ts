/**
 * Private Notification Tracker for Portfolio Events
 * Tracks only 3 approved events with strict session deduplication:
 * 1. New visitor session (no referrer / no PII)
 * 2. Meaningful Particle Engine interaction (threshold + session cooldown)
 * 3. Particle Lab opened (session cooldown)
 */

interface DeviceInfo {
  device: string;
  browser: string;
  screen: string;
}

function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined" || !navigator) {
    return { device: "Unknown", browser: "Unknown", screen: "Unknown" };
  }

  const ua = navigator.userAgent;
  let device = "Desktop";
  if (/iPad|Tablet|PlayBook/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))) {
    device = "Tablet";
  } else if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
    device = "Mobile";
  }

  let browser = "Web Browser";
  if (/Edg\//i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/Chrome\/|CriOS\//i.test(ua)) {
    browser = "Google Chrome";
  } else if (/Firefox\/|FxiOS\//i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    browser = "Apple Safari";
  } else if (/OPR\/|Opera\//i.test(ua)) {
    browser = "Opera";
  }

  const screen = typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown";

  return { device, browser, screen };
}

async function sendNotification(
  eventType: "new_visitor" | "particle_engine" | "particle_lab",
  details?: Record<string, any>
) {
  try {
    const deviceInfo = getDeviceInfo();
    const payload = {
      eventType,
      page: typeof window !== "undefined" ? window.location.pathname || "/" : "/",
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      screen: deviceInfo.screen,
      timestamp: new Date().toISOString(),
      details: details || {},
    };

    await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    // Non-blocking: fail silently to preserve visitor experience
  }
}

/**
 * 1. Track New Visitor Session
 * Sent once per genuinely new visitor session.
 */
export function trackNewVisitor() {
  if (typeof window === "undefined") return;

  try {
    const SESSION_KEY = "pm_visitor_session_sent";
    const alreadySent = sessionStorage.getItem(SESSION_KEY);
    if (alreadySent) return;

    sessionStorage.setItem(SESSION_KEY, Date.now().toString());

    // Delay by 1.5s to ensure visitor genuinely stays on the page
    setTimeout(() => {
      sendNotification("new_visitor");
    }, 1500);
  } catch (e) {
    // Ignore storage restrictions
  }
}

/**
 * 2. Track Particle Engine Interaction
 * Meaningful interaction threshold tracker.
 */
let particleInteractionScore = 0;
let particleInteractionNotified = false;
let lastInteractionTimestamp = 0;

export function registerParticleInteraction(type: "drag" | "burst" | "scatter", durationMs: number = 100) {
  if (typeof window === "undefined" || particleInteractionNotified) return;

  try {
    const SESSION_KEY = "pm_particle_engine_sent";
    if (sessionStorage.getItem(SESSION_KEY)) {
      particleInteractionNotified = true;
      return;
    }

    const now = Date.now();
    // Count score based on active duration or interaction bursts
    if (type === "drag") {
      particleInteractionScore += Math.max(1, Math.min(5, Math.floor(durationMs / 300)));
    } else if (type === "burst") {
      particleInteractionScore += 2;
    } else {
      particleInteractionScore += 1;
    }

    lastInteractionTimestamp = now;

    // Threshold: User must have performed at least ~4-5 meaningful particle manipulations
    if (particleInteractionScore >= 5 && !particleInteractionNotified) {
      particleInteractionNotified = true;
      sessionStorage.setItem(SESSION_KEY, now.toString());

      sendNotification("particle_engine", {
        interactionScore: particleInteractionScore,
        mode: "interactive_canvas",
      });
    }
  } catch (e) {
    // Ignore storage restrictions
  }
}

/**
 * 3. Track Particle Lab Opened
 * Sent once when user opens the Particle Lab modal.
 */
export function trackParticleLabOpened() {
  if (typeof window === "undefined") return;

  try {
    const SESSION_KEY = "pm_particle_lab_sent";
    const alreadySent = sessionStorage.getItem(SESSION_KEY);
    if (alreadySent) return;

    sessionStorage.setItem(SESSION_KEY, Date.now().toString());

    sendNotification("particle_lab", {
      action: "opened_playground",
    });
  } catch (e) {
    // Ignore storage restrictions
  }
}
