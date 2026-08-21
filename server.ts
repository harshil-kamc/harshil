import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { processNotification } from "./server/brevo";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      brevoConfigured: Boolean(process.env.BREVO_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Private Visitor Notification Endpoint
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
        timestamp: timestamp || new Date().toISOString(),
        details,
      });

      return res.json(result);
    } catch (err: any) {
      console.error("[Server Error /api/notify]:", err);
      return res.status(500).json({ success: false, error: "Internal notification error" });
    }
  });

  // Vite development middleware or production static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
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
