import type { IncomingMessage, ServerResponse } from "http";
// Explicit .js extension: Vercel runs this as native ESM ("type": "module")
import { diagnoseBrevo } from "../server/brevo.js";

type VercelResponse = ServerResponse & { json: (body: unknown) => void };

// Vercel serverless version of the /api/health route in server.ts.
// Add ?check=brevo to verify the email setup end to end (no email is sent).
export default async function handler(req: IncomingMessage, res: VercelResponse) {
  const checkBrevo = new URL(req.url || "/", "http://localhost").searchParams.get("check") === "brevo";
  res.json({
    status: "ok",
    brevoConfigured: Boolean(process.env.BREVO_API_KEY),
    ...(checkBrevo ? { brevo: await diagnoseBrevo() } : {}),
    timestamp: new Date().toISOString(),
  });
}
