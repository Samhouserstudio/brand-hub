import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Anthropic } from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";
import {
  signupSchema,
  loginSchema,
  createHubSchema,
  insertColorSchema,
} from "../shared/schema";
import type { BrandColor, BrandGradient, TypographyEntry, LogoAsset, BrandAsset, GuidelineModule } from "../shared/schema";

// ── Session store ──
const sessions = new Map<string, string>(); // token → userId

function getAuthUserId(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return sessions.get(token) || null;
}

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  (req as any).userId = userId;
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ══════════════════════════════════════════
  //  AUTH ROUTES
  // ══════════════════════════════════════════

  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
      return;
    }
    const { email, name, password } = parsed.data;

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const user = await storage.createUserAccount({ email, name, passwordHash: password });
    const token = randomUUID();
    sessions.set(token, user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }
    const { email, password } = parsed.data;

    const user = await storage.getUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = randomUUID();
    sessions.set(token, user.id);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) {
      sessions.delete(auth.slice(7));
    }
    res.json({ ok: true });
  });

  // ── Google OAuth ──

  app.get("/api/auth/google", (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      res.status(500).json({ message: "Google OAuth not configured" });
      return;
    }
    // Determine redirect URI from the request origin
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  });

  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
      res.status(400).json({ message: "Missing authorization code" });
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      res.status(500).json({ message: "Google OAuth not configured" });
      return;
    }

    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    try {
      // Exchange code for tokens
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        console.error("Google token exchange failed:", err);
        res.status(400).json({ message: "Failed to exchange code" });
        return;
      }

      const tokenData = await tokenRes.json() as any;

      // Get user info from Google
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userInfoRes.ok) {
        res.status(400).json({ message: "Failed to get user info" });
        return;
      }

      const googleUser = await userInfoRes.json() as any;
      const googleId = googleUser.id as string;
      const email = googleUser.email as string;
      const name = (googleUser.name as string) || email.split("@")[0];
      const avatarUrl = (googleUser.picture as string) || "";

      // Find or create user
      let user = await storage.getUserByGoogleId(googleId);
      if (!user) {
        // Check if there's an existing user with same email
        user = await storage.getUserByEmail(email);
        if (user) {
          // Link Google ID to existing account
          (user as any).googleId = googleId;
          (user as any).avatarUrl = avatarUrl;
        } else {
          // Create new account
          user = await storage.createUserAccount({
            email,
            name,
            passwordHash: "", // No password for Google OAuth users
            googleId,
            avatarUrl,
          });
        }
      }

      const token = randomUUID();
      sessions.set(token, user.id);

      // Redirect to frontend with token in hash
      // The frontend will pick up the token from the URL
      res.redirect(`/#/auth/callback?token=${encodeURIComponent(token)}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${encodeURIComponent(user.id)}`);
    } catch (err) {
      console.error("Google OAuth error:", err);
      res.redirect(`/#/login?error=${encodeURIComponent("Google sign-in failed")}`);
    }
  });

  // Token-based Google auth for the frontend to exchange the callback token
  app.post("/api/auth/google/token", async (req: Request, res: Response) => {
    const { credential } = req.body;
    if (!credential || typeof credential !== "string") {
      res.status(400).json({ message: "Missing credential" });
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      res.status(500).json({ message: "Google OAuth not configured" });
      return;
    }

    try {
      // Verify the ID token using Google's tokeninfo endpoint
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!verifyRes.ok) {
        res.status(400).json({ message: "Invalid credential" });
        return;
      }

      const payload = await verifyRes.json() as any;
      if (payload.aud !== clientId) {
        res.status(400).json({ message: "Invalid audience" });
        return;
      }

      const googleId = payload.sub as string;
      const email = payload.email as string;
      const name = (payload.name as string) || email.split("@")[0];
      const avatarUrl = (payload.picture as string) || "";

      let user = await storage.getUserByGoogleId(googleId);
      if (!user) {
        user = await storage.getUserByEmail(email);
        if (user) {
          (user as any).googleId = googleId;
          (user as any).avatarUrl = avatarUrl;
        } else {
          user = await storage.createUserAccount({
            email,
            name,
            passwordHash: "",
            googleId,
            avatarUrl,
          });
        }
      }

      const token = randomUUID();
      sessions.set(token, user.id);

      res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    } catch (err) {
      console.error("Google token verification error:", err);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await storage.getUserById(userId);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.json({ id: user.id, email: user.email, name: user.name });
  });

  // ══════════════════════════════════════════
  //  HUB MANAGEMENT (authenticated)
  // ══════════════════════════════════════════

  app.get("/api/hubs", requireAuth, async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const hubs = await storage.getHubsByOwner(userId);
    res.json(hubs);
  });

  app.post("/api/hubs", requireAuth, async (req: Request, res: Response) => {
    const parsed = createHubSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
      return;
    }
    const userId = (req as any).userId;

    // Check slug uniqueness
    const existing = await storage.getHubBySlug(parsed.data.slug);
    if (existing) {
      res.status(409).json({ message: "Slug already taken" });
      return;
    }

    const hub = await storage.createHub({
      ownerId: userId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || "",
      logoUrl: "",
      primaryColor: parsed.data.primaryColor || "#6366f1",
      accentColor: parsed.data.accentColor || "#8b5cf6",
      heroHeading: `Welcome to ${parsed.data.name}`,
      heroSubheading: "Your brand assets, all in one place.",
      published: false,
    });

    res.json(hub);
  });

  app.get("/api/hubs/:id", requireAuth, async (req: Request, res: Response) => {
    const hub = await storage.getHubById(req.params.id as string);
    if (!hub || hub.ownerId !== (req as any).userId) {
      res.status(404).json({ message: "Hub not found" });
      return;
    }
    res.json(hub);
  });

  app.patch("/api/hubs/:id", requireAuth, async (req: Request, res: Response) => {
    const hub = await storage.getHubById(req.params.id as string);
    if (!hub || hub.ownerId !== (req as any).userId) {
      res.status(404).json({ message: "Hub not found" });
      return;
    }
    const updated = await storage.updateHub(req.params.id as string, req.body);
    res.json(updated);
  });

  app.delete("/api/hubs/:id", requireAuth, async (req: Request, res: Response) => {
    const hub = await storage.getHubById(req.params.id as string);
    if (!hub || hub.ownerId !== (req as any).userId) {
      res.status(404).json({ message: "Hub not found" });
      return;
    }
    await storage.deleteHub(req.params.id as string);
    res.json({ ok: true });
  });

  // ══════════════════════════════════════════
  //  HUB ADMIN DATA (authenticated, owner only)
  // ══════════════════════════════════════════

  // Helper to validate hub ownership
  async function getOwnedHub(req: Request, res: Response): Promise<{ hubId: string } | null> {
    const hub = await storage.getHubById(req.params.id as string);
    if (!hub || hub.ownerId !== (req as any).userId) {
      res.status(404).json({ message: "Hub not found" });
      return null;
    }
    return { hubId: hub.id };
  }

  // Colors
  app.get("/api/hubs/:id/colors", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    res.json(storage.getHubColors(owned.hubId));
  });

  app.post("/api/hubs/:id/colors", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    const color: BrandColor = { id: randomUUID(), ...req.body };
    storage.addHubColor(owned.hubId, color);
    res.json(color);
  });

  app.delete("/api/hubs/:id/colors/:colorId", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    storage.removeHubColor(owned.hubId, req.params.colorId as string);
    res.json({ ok: true });
  });

  // Gradients
  app.get("/api/hubs/:id/gradients", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    res.json(storage.getHubGradients(owned.hubId));
  });

  app.post("/api/hubs/:id/gradients", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    const gradient: BrandGradient = { id: randomUUID(), ...req.body };
    storage.addHubGradient(owned.hubId, gradient);
    res.json(gradient);
  });

  app.delete("/api/hubs/:id/gradients/:gradientId", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    storage.removeHubGradient(owned.hubId, req.params.gradientId as string);
    res.json({ ok: true });
  });

  // Typography
  app.get("/api/hubs/:id/typography", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    res.json(storage.getHubTypography(owned.hubId));
  });

  app.post("/api/hubs/:id/typography", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    const entry: TypographyEntry = { id: randomUUID(), ...req.body };
    storage.addHubTypography(owned.hubId, entry);
    res.json(entry);
  });

  app.delete("/api/hubs/:id/typography/:entryId", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    storage.removeHubTypography(owned.hubId, req.params.entryId as string);
    res.json({ ok: true });
  });

  // Logos
  app.get("/api/hubs/:id/logos", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    res.json(storage.getHubLogos(owned.hubId));
  });

  app.post("/api/hubs/:id/logos", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    const logo: LogoAsset = { id: randomUUID(), ...req.body };
    storage.addHubLogo(owned.hubId, logo);
    res.json(logo);
  });

  app.delete("/api/hubs/:id/logos/:logoId", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    storage.removeHubLogo(owned.hubId, req.params.logoId as string);
    res.json({ ok: true });
  });

  // Assets
  app.get("/api/hubs/:id/assets", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    const category = req.query.category as string | undefined;
    res.json(storage.getHubAssets(owned.hubId, category));
  });

  app.post("/api/hubs/:id/assets", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    const asset: BrandAsset = { id: randomUUID(), ...req.body };
    storage.addHubAsset(owned.hubId, asset);
    res.json(asset);
  });

  app.delete("/api/hubs/:id/assets/:assetId", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    storage.removeHubAsset(owned.hubId, req.params.assetId as string);
    res.json({ ok: true });
  });

  // Guidelines
  app.get("/api/hubs/:id/guidelines", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    res.json(storage.getHubGuidelines(owned.hubId));
  });

  app.post("/api/hubs/:id/guidelines", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    const guideline: GuidelineModule = { id: randomUUID(), ...req.body };
    storage.addHubGuideline(owned.hubId, guideline);
    res.json(guideline);
  });

  app.delete("/api/hubs/:id/guidelines/:guidelineId", requireAuth, async (req: Request, res: Response) => {
    const owned = await getOwnedHub(req, res);
    if (!owned) return;
    storage.removeHubGuideline(owned.hubId, req.params.guidelineId as string);
    res.json({ ok: true });
  });

  // ══════════════════════════════════════════
  //  PUBLIC HUB ROUTES (no auth, hub must be published)
  // ══════════════════════════════════════════

  async function getPublishedHub(slug: string, res: Response) {
    const hub = await storage.getHubBySlug(slug);
    if (!hub) {
      res.status(404).json({ message: "Hub not found" });
      return null;
    }
    if (!hub.published) {
      res.status(403).json({ message: "This brand hub is not published" });
      return null;
    }
    return hub;
  }

  app.get("/api/public/:slug", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    // Return hub info (without sensitive fields)
    res.json({
      id: hub.id,
      name: hub.name,
      slug: hub.slug,
      description: hub.description,
      logoUrl: hub.logoUrl,
      primaryColor: hub.primaryColor,
      accentColor: hub.accentColor,
      heroHeading: hub.heroHeading,
      heroSubheading: hub.heroSubheading,
    });
  });

  app.get("/api/public/:slug/colors", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    res.json(storage.getHubColors(hub.id));
  });

  app.get("/api/public/:slug/gradients", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    res.json(storage.getHubGradients(hub.id));
  });

  app.get("/api/public/:slug/typography", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    res.json(storage.getHubTypography(hub.id));
  });

  app.get("/api/public/:slug/logos", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    res.json(storage.getHubLogos(hub.id));
  });

  app.get("/api/public/:slug/assets", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    const category = req.query.category as string | undefined;
    res.json(storage.getHubAssets(hub.id, category));
  });

  app.get("/api/public/:slug/guidelines", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    res.json(storage.getHubGuidelines(hub.id));
  });

  app.get("/api/public/:slug/featured", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    res.json(storage.getHubFeaturedAssets(hub.id));
  });

  app.get("/api/public/:slug/search", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;
    const query = (req.query.q as string) || "";
    if (!query.trim()) { res.json([]); return; }
    res.json(storage.searchHubAssets(hub.id, query));
  });

  // AI search (scoped per hub)
  app.post("/api/public/:slug/ai-search", async (req: Request, res: Response) => {
    const hub = await getPublishedHub(req.params.slug as string, res);
    if (!hub) return;

    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Query is required" });
      return;
    }

    const colors = storage.getHubColors(hub.id);
    const gradients = storage.getHubGradients(hub.id);
    const typography = storage.getHubTypography(hub.id);
    const logos = storage.getHubLogos(hub.id);
    const guidelines = storage.getHubGuidelines(hub.id);
    const assets = storage.getHubAssets(hub.id);
    const searchResults = storage.searchHubAssets(hub.id, query);

    const brandContext = `
You are a brand assistant for ${hub.name}. You help users find brand assets, colors, fonts, and guidelines.

BRAND DATA:

COLORS:
${colors.map((c) => `- ${c.name} (${c.hex}) — ${c.role} — ${c.description}`).join("\n")}

GRADIENTS:
${gradients.map((g) => `- ${g.name}: ${g.css} — ${g.description}`).join("\n")}

TYPOGRAPHY:
${typography.map((t) => `- ${t.familyName} (${t.role}): ${t.usageDescription}`).join("\n")}

LOGOS:
${logos.map((l) => `- ${l.title}: ${l.description}. Tags: ${l.tags.join(", ")}`).join("\n")}

GUIDELINES:
${guidelines.map((g) => `- ${g.title}: ${g.content.substring(0, 150)}`).join("\n")}

OTHER ASSETS:
${assets.filter(a => a.category !== 'logos').map((a) => `- ${a.title} (${a.category}): ${a.description}. Tags: ${a.tags.join(", ")}`).join("\n")}

MATCHED RESULTS:
${searchResults.map((r) => `- [${r.type}] ${r.title}: ${r.description}`).join("\n")}
`;

    try {
      const client = new Anthropic();
      const message = await client.messages.create({
        model: "claude_sonnet_4_6",
        max_tokens: 600,
        system: brandContext + "\n\nRespond concisely (2-4 sentences max). Be specific about which assets match. If they ask about a color, include the hex value. If they ask about a font, name the font and its role. Always be helpful and direct. Do not use markdown formatting.",
        messages: [{ role: "user", content: query }],
      });

      const aiResponse =
        message.content[0].type === "text" ? message.content[0].text : "";

      res.json({
        answer: aiResponse,
        results: searchResults,
      });
    } catch (err) {
      console.log("AI search fallback to keyword:", err);

      let fallbackAnswer = "";
      if (searchResults.length > 0) {
        const topResult = searchResults[0];
        fallbackAnswer = `Found ${searchResults.length} result${searchResults.length > 1 ? "s" : ""} matching "${query}". The top match is "${topResult.title}" in ${topResult.category}.`;
      } else {
        fallbackAnswer = `No exact matches found for "${query}". Try browsing the categories or searching with different terms.`;
      }

      res.json({
        answer: fallbackAnswer,
        results: searchResults,
      });
    }
  });

  return httpServer;
}
