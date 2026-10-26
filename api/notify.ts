import type { IncomingMessage, ServerResponse } from "http";
import type { Request } from "express";
// Explicit .js extension: Vercel runs this as native ESM ("type": "module")
import { isAllowedOrigin, processNotification } from "../server/brevo.js";

type VercelRequest = IncomingMessage & { body?: any };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

// Vercel serverless version of the /api/notify route in server.ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  if (!isAllowedOrigin(req as unknown as Request)) {
    return res.status(403).json({ success: false, error: "Forbidden" });
  }

  try {
    const { eventType, page, device, browser, screen, timestamp, details } = req.body || {};

    if (!eventType || !["new_visitor", "particle_engine", "particle_lab"].includes(eventType)) {
      return res.status(400).json({ success: false, error: "Invalid or missing eventType" });
    }

    const result = await processNotification(req as unknown as Request, {
      eventType,
      page: page || "/",
      device: device || "Desktop",
      browser: browser || "Web Browser",
      screen,
      timestamp: timestamp || new Date().toISOString(),
      details,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("[Vercel Error /api/notify]:", err);
    return res.status(500).json({ success: false, error: "Internal notification error" });
  }
}
