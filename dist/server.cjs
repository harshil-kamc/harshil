var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/brevo.ts
var eventCooldownCache = /* @__PURE__ */ new Map();
var COOLDOWN_DURATION_MS = 15 * 60 * 1e3;
function cleanOldCooldowns() {
  const now = Date.now();
  for (const [key, timestamp] of eventCooldownCache.entries()) {
    if (now - timestamp > COOLDOWN_DURATION_MS * 2) {
      eventCooldownCache.delete(key);
    }
  }
}
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || req.ip || "127.0.0.1";
  }
  return req.headers["x-real-ip"] || req.ip || "127.0.0.1";
}
async function getApproximateLocation(req, ip) {
  const cfCountry = req.headers["cf-ipcountry"];
  const cfCity = req.headers["cf-ipcity"];
  if (cfCountry && cfCity) return `${cfCity}, ${cfCountry}`;
  if (cfCountry) return `Country: ${cfCountry}`;
  const vercelCountry = req.headers["x-vercel-ip-country"];
  const vercelCity = req.headers["x-vercel-ip-city"];
  if (vercelCountry && vercelCity) return `${vercelCity}, ${vercelCountry}`;
  if (vercelCountry) return `Country: ${vercelCountry}`;
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.")) {
    return "Local / Sandbox Network";
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data.status === "success" && data.country) {
        return [data.city, data.regionName, data.country].filter(Boolean).join(", ");
      }
    }
  } catch (err) {
  }
  return "Location unavailable";
}
function generateEmailHtml(data) {
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
        <strong>Portfolio Monitor \u{1F680}</strong> &bull; Private Visitor Alerts<br>
        Delivered directly via Brevo Transactional Email Service
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
async function processNotification(req, payload) {
  cleanOldCooldowns();
  const ip = getClientIp(req);
  const cooldownKey = `${ip}_${payload.eventType}`;
  const now = Date.now();
  const lastTriggered = eventCooldownCache.get(cooldownKey);
  if (lastTriggered && now - lastTriggered < COOLDOWN_DURATION_MS) {
    return {
      success: true,
      message: "Event already notified recently (cooldown active)"
    };
  }
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.NOTIFICATION_RECIPIENT_EMAIL || "heybreakindown@gmail.com";
  const recipientEmail = process.env.NOTIFICATION_RECIPIENT_EMAIL || "heybreakindown@gmail.com";
  if (!brevoApiKey) {
    console.warn("[Portfolio Monitor] BREVO_API_KEY environment variable is not configured. Email notification skipped.");
    return {
      success: true,
      message: "BREVO_API_KEY not configured yet on server"
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
    hour12: true
  }).format(dateObj) + " (IST)";
  let subject = "";
  let eventBadge = "";
  let eventDescription = "";
  switch (payload.eventType) {
    case "new_visitor":
      subject = "\u{1F680} Someone just visited your portfolio";
      eventBadge = "New Visitor Session";
      eventDescription = "A genuinely new visitor has arrived at your portfolio and started an active browsing session.";
      break;
    case "particle_engine":
      subject = "\u2728 Someone is interacting with your Particle Engine";
      eventBadge = "Particle Engine Interaction";
      eventDescription = "A visitor is actively dragging, scattering, and experimenting with the interactive canvas particles.";
      break;
    case "particle_lab":
      subject = "\u26A1 Someone opened your Particle Lab";
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
    eventDescription
  });
  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "Portfolio Monitor \u{1F680}",
          email: senderEmail
        },
        to: [
          {
            email: recipientEmail,
            name: "Harshil"
          }
        ],
        subject,
        htmlContent
      })
    });
    if (!brevoResponse.ok) {
      const errBody = await brevoResponse.text();
      console.error("[Portfolio Monitor] Brevo API Error:", brevoResponse.status, errBody);
      let parsedError = errBody;
      try {
        const jsonErr = JSON.parse(errBody);
        parsedError = jsonErr.message || errBody;
      } catch (e) {
      }
      return {
        success: false,
        message: `Brevo API status ${brevoResponse.status}: ${parsedError}`
      };
    }
    eventCooldownCache.set(cooldownKey, now);
    console.log(`[Portfolio Monitor] Sent email alert for event "${payload.eventType}" to ${recipientEmail}`);
    return {
      success: true,
      message: "Notification sent successfully"
    };
  } catch (error) {
    console.error("[Portfolio Monitor] Network error calling Brevo:", error);
    return {
      success: false,
      message: error?.message || "Failed to deliver email"
    };
  }
}

// server.ts
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      brevoConfigured: Boolean(process.env.BREVO_API_KEY),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.post("/api/notify", async (req, res) => {
    try {
      const { eventType, page, device, browser, screen, timestamp, details } = req.body;
      if (!eventType || !["new_visitor", "particle_engine", "particle_lab"].includes(eventType)) {
        return res.status(400).json({ success: false, error: "Invalid or missing eventType" });
      }
      const result = await processNotification(req, {
        eventType,
        page: page || "/",
        device: device || "Desktop",
        browser: browser || "Web Browser",
        screen,
        timestamp: timestamp || (/* @__PURE__ */ new Date()).toISOString(),
        details
      });
      return res.json(result);
    } catch (err) {
      console.error("[Server Error /api/notify]:", err);
      return res.status(500).json({ success: false, error: "Internal notification error" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
