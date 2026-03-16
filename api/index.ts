import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Await route registration so routes exist before the first request hits
let ready: Promise<void> | null = null;

function ensureReady() {
  if (!ready) {
    ready = registerRoutes(httpServer, app).then(() => {
      // Error handler (must be registered after all routes)
      app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("Internal Server Error:", err);
        if (res.headersSent) {
          return next(err);
        }
        return res.status(status).json({ message });
      });
    });
  }
  return ready;
}

// Wrap in a handler that awaits initialization before handling requests
const handler = async (req: Request, res: Response) => {
  await ensureReady();
  app(req, res);
};

export default handler;
