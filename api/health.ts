import type { IncomingMessage, ServerResponse } from "http";

type VercelResponse = ServerResponse & { json: (body: unknown) => void };

// Vercel serverless version of the /api/health route in server.ts
export default function handler(_req: IncomingMessage, res: VercelResponse) {
  res.json({
    status: "ok",
    brevoConfigured: Boolean(process.env.BREVO_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
