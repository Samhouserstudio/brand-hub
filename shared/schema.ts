import { z } from "zod";

// ── Category types ──
export const assetCategories = [
  "logos",
  "colors",
  "gradients",
  "typography",
  "images",
  "artwork",
  "icons",
  "templates",
  "guidelines",
] as const;

export type AssetCategory = (typeof assetCategories)[number];

export const assetCategoryLabels: Record<AssetCategory, string> = {
  logos: "Logos",
  colors: "Colors",
  gradients: "Gradients",
  typography: "Typography",
  images: "Images",
  artwork: "Artwork",
  icons: "Icons",
  templates: "Templates",
  guidelines: "Brand Guidelines",
};

// ── Brand Asset ──
export interface BrandAsset {
  id: string;
  category: AssetCategory;
  subcategory: string;
  title: string;
  description: string;
  tags: string[];
  usageNotes: string;
  searchPhrases: string[];
  previewUrl: string;
  downloadFiles: DownloadFile[];
  visibility: "public" | "private" | "internal";
  featured: boolean;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadFile {
  name: string;
  format: string;
  url: string;
  size: string;
}

// ── Logo Asset ──
export interface LogoAsset extends BrandAsset {
  category: "logos";
  variants: LogoVariant[];
  minimumSize: string;
  clearSpace: string;
}

export interface LogoVariant {
  name: string;
  previewUrl: string;
  backgroundSuggestion: "light" | "dark" | "transparent" | "any";
  downloadFiles: DownloadFile[];
}

// ── Color ──
export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string;
  role: "primary" | "secondary" | "neutral" | "accent" | "semantic";
  group: string;
  description: string;
}

// ── Gradient ──
export interface BrandGradient {
  id: string;
  name: string;
  css: string;
  colors: string[];
  description: string;
  tags: string[];
}

// ── Typography ──
export interface TypographyEntry {
  id: string;
  familyName: string;
  role: string;
  classification: string;
  weights: string[];
  specimenPreview: string;
  hierarchyExamples: TypographyHierarchy[];
  usageDescription: string;
  downloadUrl: string;
  fontUrl: string;
}

export interface TypographyHierarchy {
  level: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  sample: string;
}

// ── Brand Guideline Module ──
export interface GuidelineModule {
  id: string;
  title: string;
  slug: string;
  order: number;
  content: string;
  type: "overview" | "usage" | "examples" | "dos-donts";
}

// ── Organization ──
export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  heroHeading: string;
  heroSubheading: string;
  primaryColor: string;
  accentColor: string;
}

// ── Search Result ──
export interface SearchResult {
  type: "asset" | "color" | "gradient" | "typography" | "guideline";
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  category: string;
  relevance: number;
  downloadFiles?: DownloadFile[];
}

// ── User Account ──
export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

// ── Brand Hub ──
export interface BrandHub {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  heroHeading: string;
  heroSubheading: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── AI Search schemas ──
export const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// ── Auth schemas ──
export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// ── Hub schemas ──
export const createHubSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().default(""),
  primaryColor: z.string().optional().default("#6366f1"),
  accentColor: z.string().optional().default("#8b5cf6"),
});

// ── Insert schemas (for admin) ──
export const insertAssetSchema = z.object({
  category: z.enum(assetCategories),
  subcategory: z.string(),
  title: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
  usageNotes: z.string().optional().default(""),
  searchPhrases: z.array(z.string()).optional().default([]),
  visibility: z.enum(["public", "private", "internal"]).default("public"),
  featured: z.boolean().default(false),
  isPrimary: z.boolean().default(false),
});

export type InsertAsset = z.infer<typeof insertAssetSchema>;

export const insertColorSchema = z.object({
  name: z.string().min(1),
  hex: z.string(),
  rgb: z.string(),
  cmyk: z.string().optional().default(""),
  pantone: z.string().optional().default(""),
  role: z.enum(["primary", "secondary", "neutral", "accent", "semantic"]),
  group: z.string(),
  description: z.string().optional().default(""),
});

export type InsertColor = z.infer<typeof insertColorSchema>;

// keep the unused drizzle imports so the template doesn't complain
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
