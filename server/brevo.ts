import type { Request } from "express";

interface NotificationPayload {
  eventType: "new_visitor" | "particle_engine" | "particle_lab";
  page: string;
  device: string;
  browser: string;
  screen?: string;
  timestamp: string;
  details?: Record<string, any>;
}

// In-memory cooldown cache for deduplication (per IP + event type)
const eventCooldownCache = new Map<string, number>();
const COOLDOWN_DURATION_MS = 15 * 60 * 1000; // 15 minutes cooldown per event type per visitor

function cleanOldCooldowns() {
  const now = Date.now();
  for (const [key, timestamp] of eventCooldownCache.entries()) {
    if (now - timestamp > COOLDOWN_DURATION_MS * 2) {
      eventCooldownCache.delete(key);
    }
  }
}

// Extract client IP address
function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || req.ip || "127.0.0.1";
  }
  return (req.headers["x-real-ip"] as string) || req.ip || "127.0.0.1";
}

// Extract approximate location if provided by cloud provider headers or geo lookups
async function getApproximateLocation(req: Request, ip: string): Promise<string> {
  // 1. Check Cloudflare / CDN / Render headers
  const cfCountry = req.headers["cf-ipcountry"] as string;
  const cfCity = req.headers["cf-ipcity"] as string;
  if (cfCountry && cfCity) return `${cfCity}, ${cfCountry}`;
  if (cfCountry) return `Country: ${cfCountry}`;

  const vercelCountry = req.headers["x-vercel-ip-country"] as string;
  const vercelCity = req.headers["x-vercel-ip-city"] as string;
  if (vercelCountry && vercelCity) return `${vercelCity}, ${vercelCountry}`;
  if (vercelCountry) return `Country: ${vercelCountry}`;

  // 2. If private/local IP, skip
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.")
  ) {
    return "Local / Sandbox Network";
  }

  // 3. Fast non-blocking IP lookup fallback with 1.5s timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as { status: string; city?: string; regionName?: string; country?: string };
      if (data.status === "success" && data.country) {
        return [data.city, data.regionName, data.country].filter(Boolean).join(", ");
      }
    }
  } catch (err) {
    // Fail silently on geo lookup
  }

  return "Location unavailable";
}

// Generate the HTML email template with custom cursor branding
function generateEmailHtml(data: {
  headline: string;
  subject: string;
  eventBadge: string;
  timeFormatted: string;
  page: string;
  device: string;
  browser: string;
  location: string;
  eventDescription: string;
}): string {
  const brandLogoUrl = "https://i.ibb.co/wZ68jDqH/image.png";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #09090b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f4f4f5;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #09090b;
      padding: 36px 12px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: linear-gradient(180deg, #18181b 0%, #0f0f12 100%);
      border: 1px solid #27272a;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      padding: 28px 24px 20px 24px;
      background: linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(24, 24, 27, 0) 100%);
      border-bottom: 1px solid #27272a;
      text-align: center;
    }
    .logo-container {
      display: inline-block;
      width: 48px;
      height: 48px;
      background-color: #121215;
      border: 1px solid #3f3f46;
      border-radius: 12px;
      padding: 6px;
      margin-bottom: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #34d399;
      background-color: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(52, 211, 153, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .headline {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 24px;
    }
    .description-box {
      background-color: #121215;
      border: 1px solid #27272a;
      border-left: 3px solid #10b981;
      padding: 14px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #d4d4d8;
      line-height: 1.5;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #121215;
      border: 1px solid #27272a;
      border-radius: 10px;
      overflow: hidden;
    }
    .data-row {
      border-bottom: 1px solid #1f1f23;
    }
    .data-row:last-child {
      border-bottom: none;
    }
    .data-label {
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #a1a1aa;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      width: 32%;
      background-color: rgba(255, 255, 255, 0.015);
    }
    .data-value {
      padding: 12px 16px;
      font-size: 13px;
      color: #f4f4f5;
      font-weight: 500;
    }
    .data-value-highlight {
      color: #34d399;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
    }
    .footer {
      padding: 20px 24px;
      background-color: #0d0d10;
      border-top: 1px solid #27272a;
      text-align: center;
      font-size: 11px;
      color: #71717a;
      line-height: 1.5;
    }
    .footer strong {
      color: #a1a1aa;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header with Cursor Brand Logo -->
      <div class="header">
        <div class="logo-container">
          <img src="${brandLogoUrl}" alt="Portfolio Logo" class="logo-img" />
        </div>
        <div>
          <span class="badge">${data.eventBadge}</span>
        </div>
        <h1 class="headline">${data.headline}</h1>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="description-box">
          ${data.eventDescription}
        </div>

        <table class="data-table" cellpadding="0" cellspacing="0">
          <tr class="data-row">
            <td class="data-label">Event</td>
            <td class="data-value data-value-highlight">${data.eventBadge}</td>
          </tr>
          <tr class="data-row">
            <td class="data-label">Time (IST)</td>
            <td class="data-value">${data.timeFormatted}</td>
          </tr>
          <tr class="data-row">
            <td class="data-label">Page</td>
            <td class="data-value"><code>${data.page}</code></td>
          </tr>
          <tr class="data-row">
            <td class="data-label">Device</td>
            <td class="data-value">${data.device}</td>
          </tr>
          <tr class="data-row">
            <td class="data-label">Browser</td>
            <td class="data-value">${data.browser}</td>
          </tr>
          <tr class="data-row">
            <td class="data-label">Location</td>
            <td class="data-value">${data.location}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div class="footer">
        <strong>Portfolio Monitor 🚀</strong> &bull; Private Visitor Alerts<br>
        Delivered directly via Brevo Transactional Email Service
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function processNotification(req: Request, payload: NotificationPayload): Promise<{ success: boolean; message: string }> {
  cleanOldCooldowns();

  const ip = getClientIp(req);
  const cooldownKey = `${ip}_${payload.eventType}`;
  const now = Date.now();

  // Server-side cooldown check
  const lastTriggered = eventCooldownCache.get(cooldownKey);
  if (lastTriggered && now - lastTriggered < COOLDOWN_DURATION_MS) {
    return {
      success: true,
      message: "Event already notified recently (cooldown active)",
    };
  }

  // Check Brevo credentials
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.NOTIFICATION_RECIPIENT_EMAIL || "heybreakindown@gmail.com";
  const recipientEmail = process.env.NOTIFICATION_RECIPIENT_EMAIL || "heybreakindown@gmail.com";

  if (!brevoApiKey) {
    console.warn("[Portfolio Monitor] BREVO_API_KEY environment variable is not configured. Email notification skipped.");
    return {
      success: true,
      message: "BREVO_API_KEY not configured yet on server",
    };
  }

  const approximateLocation = await getApproximateLocation(req, ip);

  const dateObj = new Date(payload.timestamp || now);
  const timeFormatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(dateObj) + " (IST)";

  // Match the exact 3 subjects requested
  let subject = "";
  let eventBadge = "";
  let eventDescription = "";

  switch (payload.eventType) {
    case "new_visitor":
      subject = "🚀 Someone just visited your portfolio";
      eventBadge = "New Visitor Session";
      eventDescription = "A genuinely new visitor has arrived at your portfolio and started an active browsing session.";
      break;
    case "particle_engine":
      subject = "✨ Someone is interacting with your Particle Engine";
      eventBadge = "Particle Engine Interaction";
      eventDescription = "A visitor is actively dragging, scattering, and experimenting with the interactive canvas particles.";
      break;
    case "particle_lab":
      subject = "⚡ Someone opened your Particle Lab";
      eventBadge = "Particle Lab Opened";
      eventDescription = "A visitor opened the Particle Lab playground to customize words, image particles, or visual modes.";
      break;
    default:
      return { success: false, message: "Unsupported event type" };
  }

  const htmlContent = generateEmailHtml({
    headline: subject,
    subject,
    eventBadge,
    timeFormatted,
    page: payload.page || "/",
    device: payload.device || "Desktop",
    browser: payload.browser || "Web Browser",
    location: approximateLocation,
    eventDescription,
  });

  // Call Brevo REST API v3
  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Portfolio Monitor 🚀",
          email: senderEmail,
        },
        to: [
          {
            email: recipientEmail,
            name: "Harshil",
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!brevoResponse.ok) {
      const errBody = await brevoResponse.text();
      console.error("[Portfolio Monitor] Brevo API Error:", brevoResponse.status, errBody);
      let parsedError = errBody;
      try {
        const jsonErr = JSON.parse(errBody);
        parsedError = jsonErr.message || errBody;
      } catch (e) {
        // use raw text
      }
      return {
        success: false,
        message: `Brevo API status ${brevoResponse.status}: ${parsedError}`,
      };
    }

    // Set cooldown on successful transmission
    eventCooldownCache.set(cooldownKey, now);
    console.log(`[Portfolio Monitor] Sent email alert for event "${payload.eventType}" to ${recipientEmail}`);

    return {
      success: true,
      message: "Notification sent successfully",
    };
  } catch (error: any) {
    console.error("[Portfolio Monitor] Network error calling Brevo:", error);
    return {
      success: false,
      message: error?.message || "Failed to deliver email",
    };
  }
}
