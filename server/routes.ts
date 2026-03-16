import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Anthropic } from "@anthropic-ai/sdk";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Organization info
  app.get("/api/organization", (_req, res) => {
    res.json(storage.getOrganization());
  });

  // Assets
  app.get("/api/assets", (req, res) => {
    const category = req.query.category as string | undefined;
    res.json(storage.getAssets(category));
  });

  app.get("/api/assets/:id", (req, res) => {
    const asset = storage.getAssetById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  });

  app.get("/api/featured", (_req, res) => {
    res.json(storage.getFeaturedAssets());
  });

  // Logos
  app.get("/api/logos", (_req, res) => {
    res.json(storage.getLogos());
  });

  // Colors
  app.get("/api/colors", (_req, res) => {
    res.json(storage.getColors());
  });

  // Gradients
  app.get("/api/gradients", (_req, res) => {
    res.json(storage.getGradients());
  });

  // Typography
  app.get("/api/typography", (_req, res) => {
    res.json(storage.getTypography());
  });

  // Guidelines
  app.get("/api/guidelines", (_req, res) => {
    res.json(storage.getGuidelines());
  });

  // Basic search
  app.get("/api/search", (req, res) => {
    const query = (req.query.q as string) || "";
    if (!query.trim()) return res.json([]);
    res.json(storage.searchAssets(query));
  });

  // AI search (uses Anthropic if available, falls back to keyword)
  app.post("/api/ai-search", async (req, res) => {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query is required" });
    }

    // Get all brand data for context
    const colors = storage.getColors();
    const gradients = storage.getGradients();
    const typography = storage.getTypography();
    const logos = storage.getLogos();
    const guidelines = storage.getGuidelines();
    const assets = storage.getAssets();
    const searchResults = storage.searchAssets(query);

    // Build brand context
    const brandContext = `
You are a brand assistant for Meridian. You help users find brand assets, colors, fonts, and guidelines.

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
      // Fall back to keyword search if AI unavailable
      console.log("AI search fallback to keyword:", err);

      // Generate a simple response based on keyword matches
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
