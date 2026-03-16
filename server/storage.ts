import type {
  BrandAsset,
  BrandColor,
  BrandGradient,
  TypographyEntry,
  GuidelineModule,
  LogoAsset,
  SearchResult,
  UserAccount,
  BrandHub,
} from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Auth
  getUserByEmail(email: string): Promise<UserAccount | undefined>;
  getUserById(id: string): Promise<UserAccount | undefined>;
  getUserByGoogleId(googleId: string): Promise<UserAccount | undefined>;
  createUserAccount(data: { email: string; name: string; passwordHash: string; googleId?: string; avatarUrl?: string }): Promise<UserAccount>;

  // Brand Hubs
  getHubsByOwner(ownerId: string): Promise<BrandHub[]>;
  getHubBySlug(slug: string): Promise<BrandHub | undefined>;
  getHubById(id: string): Promise<BrandHub | undefined>;
  createHub(data: Omit<BrandHub, "id" | "createdAt" | "updatedAt">): Promise<BrandHub>;
  updateHub(id: string, data: Partial<BrandHub>): Promise<BrandHub>;
  deleteHub(id: string): Promise<void>;

  // Hub-scoped data
  getHubColors(hubId: string): BrandColor[];
  addHubColor(hubId: string, color: BrandColor): void;
  removeHubColor(hubId: string, colorId: string): void;
  getHubGradients(hubId: string): BrandGradient[];
  addHubGradient(hubId: string, gradient: BrandGradient): void;
  removeHubGradient(hubId: string, gradientId: string): void;
  getHubTypography(hubId: string): TypographyEntry[];
  addHubTypography(hubId: string, entry: TypographyEntry): void;
  removeHubTypography(hubId: string, entryId: string): void;
  getHubLogos(hubId: string): LogoAsset[];
  addHubLogo(hubId: string, logo: LogoAsset): void;
  removeHubLogo(hubId: string, logoId: string): void;
  getHubAssets(hubId: string, category?: string): BrandAsset[];
  addHubAsset(hubId: string, asset: BrandAsset): void;
  removeHubAsset(hubId: string, assetId: string): void;
  getHubGuidelines(hubId: string): GuidelineModule[];
  addHubGuideline(hubId: string, guideline: GuidelineModule): void;
  removeHubGuideline(hubId: string, guidelineId: string): void;
  getHubFeaturedAssets(hubId: string): BrandAsset[];
  searchHubAssets(hubId: string, query: string): SearchResult[];
}

// ── Demo data seed ──

const demoColors: BrandColor[] = [
  { id: "c1", name: "Midnight", hex: "#1a1a2e", rgb: "26, 26, 46", cmyk: "43, 43, 0, 82", pantone: "2768 C", role: "primary", group: "Primary", description: "Primary brand color used for headlines, primary buttons, and key UI elements." },
  { id: "c2", name: "Indigo", hex: "#6366f1", rgb: "99, 102, 241", cmyk: "59, 58, 0, 5", pantone: "2726 C", role: "primary", group: "Primary", description: "Primary accent for interactive elements, links, and CTAs." },
  { id: "c3", name: "Violet", hex: "#8b5cf6", rgb: "139, 92, 246", cmyk: "43, 63, 0, 4", pantone: "2655 C", role: "secondary", group: "Secondary", description: "Secondary accent for gradients, decorative elements, and hover states." },
  { id: "c4", name: "Soft Lavender", hex: "#c4b5fd", rgb: "196, 181, 253", cmyk: "23, 28, 0, 1", pantone: "2645 C", role: "secondary", group: "Secondary", description: "Lighter secondary for backgrounds, tags, and subtle highlights." },
  { id: "c5", name: "Slate 900", hex: "#0f172a", rgb: "15, 23, 42", cmyk: "64, 45, 0, 84", pantone: "Black 6 C", role: "neutral", group: "Neutrals", description: "Darkest neutral for text and dark backgrounds." },
  { id: "c6", name: "Slate 700", hex: "#334155", rgb: "51, 65, 85", cmyk: "40, 24, 0, 67", pantone: "7545 C", role: "neutral", group: "Neutrals", description: "Secondary text color for body copy and descriptions." },
  { id: "c7", name: "Slate 400", hex: "#94a3b8", rgb: "148, 163, 184", cmyk: "20, 11, 0, 28", pantone: "7543 C", role: "neutral", group: "Neutrals", description: "Muted text, placeholders, and borders." },
  { id: "c8", name: "Slate 100", hex: "#f1f5f9", rgb: "241, 245, 249", cmyk: "3, 2, 0, 2", pantone: "656 C", role: "neutral", group: "Neutrals", description: "Light surface backgrounds and card fills." },
  { id: "c9", name: "White", hex: "#ffffff", rgb: "255, 255, 255", cmyk: "0, 0, 0, 0", pantone: "", role: "neutral", group: "Neutrals", description: "Primary background color." },
  { id: "c10", name: "Emerald", hex: "#10b981", rgb: "16, 185, 129", cmyk: "91, 0, 30, 27", pantone: "3395 C", role: "semantic", group: "Semantic", description: "Success states, positive indicators, and confirmations." },
  { id: "c11", name: "Amber", hex: "#f59e0b", rgb: "245, 158, 11", cmyk: "0, 36, 96, 4", pantone: "1235 C", role: "semantic", group: "Semantic", description: "Warning states, caution indicators, and attention." },
  { id: "c12", name: "Rose", hex: "#f43f5e", rgb: "244, 63, 94", cmyk: "0, 74, 62, 4", pantone: "185 C", role: "semantic", group: "Semantic", description: "Error states, destructive actions, and critical alerts." },
];

const demoGradients: BrandGradient[] = [
  { id: "g1", name: "Brand Primary", css: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", colors: ["#6366f1", "#8b5cf6"], description: "Primary brand gradient for hero sections and key CTAs.", tags: ["hero", "primary", "web"] },
  { id: "g2", name: "Midnight Fade", css: "linear-gradient(135deg, #1a1a2e 0%, #6366f1 100%)", colors: ["#1a1a2e", "#6366f1"], description: "Dark-to-accent gradient for immersive backgrounds and dark sections.", tags: ["dark", "background", "web"] },
  { id: "g3", name: "Aurora", css: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)", colors: ["#6366f1", "#ec4899", "#f59e0b"], description: "Multi-color gradient for special campaigns and premium features.", tags: ["campaign", "premium", "social"] },
  { id: "g4", name: "Subtle Lavender", css: "linear-gradient(135deg, #f1f5f9 0%, #ede9fe 100%)", colors: ["#f1f5f9", "#ede9fe"], description: "Soft background gradient for light sections and cards.", tags: ["light", "background", "subtle"] },
  { id: "g5", name: "Ocean Deep", css: "linear-gradient(135deg, #1a1a2e 0%, #312e81 50%, #6366f1 100%)", colors: ["#1a1a2e", "#312e81", "#6366f1"], description: "Deep gradient for presentation title slides and feature sections.", tags: ["presentation", "dark", "feature"] },
];

const demoTypography: TypographyEntry[] = [
  {
    id: "t1",
    familyName: "Cabinet Grotesk",
    role: "Primary Display",
    classification: "Display Sans-Serif",
    weights: ["400", "500", "700", "800"],
    specimenPreview: "Cabinet Grotesk",
    hierarchyExamples: [
      { level: "H1", fontSize: "36px", fontWeight: "800", lineHeight: "1.1", sample: "Brand Headlines" },
      { level: "H2", fontSize: "28px", fontWeight: "700", lineHeight: "1.2", sample: "Section Titles" },
      { level: "H3", fontSize: "22px", fontWeight: "700", lineHeight: "1.3", sample: "Subsection Headings" },
    ],
    usageDescription: "Use Cabinet Grotesk for all headlines, page titles, hero text, and display-level type. Its geometric character gives Meridian a modern, confident presence. Never use below 18px.",
    downloadUrl: "#",
    fontUrl: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap",
  },
  {
    id: "t2",
    familyName: "Satoshi",
    role: "Primary Body",
    classification: "Humanist Sans-Serif",
    weights: ["300", "400", "500", "700"],
    specimenPreview: "Satoshi",
    hierarchyExamples: [
      { level: "Body", fontSize: "16px", fontWeight: "400", lineHeight: "1.6", sample: "The quick brown fox jumps over the lazy dog. Satoshi provides excellent readability at body sizes." },
      { level: "Caption", fontSize: "14px", fontWeight: "400", lineHeight: "1.5", sample: "Captions, labels, and secondary text" },
      { level: "Small", fontSize: "12px", fontWeight: "500", lineHeight: "1.4", sample: "Metadata, tags, timestamps" },
      { level: "Button", fontSize: "14px", fontWeight: "500", lineHeight: "1", sample: "BUTTON LABEL" },
    ],
    usageDescription: "Satoshi is the primary body typeface for all running text, UI labels, buttons, captions, and metadata. Its warmth and openness pair perfectly with Cabinet Grotesk's geometry.",
    downloadUrl: "#",
    fontUrl: "https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap",
  },
  {
    id: "t3",
    familyName: "JetBrains Mono",
    role: "Monospace / Code",
    classification: "Monospace",
    weights: ["400", "500", "700"],
    specimenPreview: "JetBrains Mono",
    hierarchyExamples: [
      { level: "Code", fontSize: "14px", fontWeight: "400", lineHeight: "1.6", sample: 'const brand = { name: "Meridian" };' },
      { level: "Data", fontSize: "12px", fontWeight: "500", lineHeight: "1.4", sample: "#6366F1 · RGB(99, 102, 241)" },
    ],
    usageDescription: "Use JetBrains Mono for code blocks, color values, technical data, and monospaced contexts.",
    downloadUrl: "#",
    fontUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
];

const demoLogos: LogoAsset[] = [
  {
    id: "logo-1",
    category: "logos",
    subcategory: "Primary",
    title: "Primary Logo",
    description: "The primary Meridian logo. Use this as the default logo in most contexts.",
    tags: ["primary", "main", "full-color", "web", "print"],
    usageNotes: "Minimum size: 120px wide for digital, 1 inch for print. Maintain clear space equal to the height of the 'M' icon on all sides.",
    searchPhrases: ["main logo", "default logo", "brand mark", "company logo"],
    previewUrl: "",
    downloadFiles: [
      { name: "meridian-logo.svg", format: "SVG", url: "#", size: "12 KB" },
      { name: "meridian-logo.png", format: "PNG", url: "#", size: "45 KB" },
      { name: "meridian-logo.pdf", format: "PDF", url: "#", size: "89 KB" },
    ],
    visibility: "public",
    featured: true,
    isPrimary: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-03-01",
    variants: [
      { name: "Full Color", previewUrl: "", backgroundSuggestion: "light", downloadFiles: [{ name: "logo-color.svg", format: "SVG", url: "#", size: "12 KB" }] },
      { name: "White", previewUrl: "", backgroundSuggestion: "dark", downloadFiles: [{ name: "logo-white.svg", format: "SVG", url: "#", size: "11 KB" }] },
      { name: "Dark", previewUrl: "", backgroundSuggestion: "light", downloadFiles: [{ name: "logo-dark.svg", format: "SVG", url: "#", size: "11 KB" }] },
    ],
    minimumSize: "120px wide (digital), 1 inch (print)",
    clearSpace: "Height of the M icon on all sides",
  },
  {
    id: "logo-2",
    category: "logos",
    subcategory: "Secondary",
    title: "Icon Mark",
    description: "Standalone M icon for small spaces, favicons, and social avatars.",
    tags: ["icon", "mark", "symbol", "favicon", "social", "avatar", "square"],
    usageNotes: "Use when the full logo doesn't fit. Works at sizes as small as 16px.",
    searchPhrases: ["icon", "symbol", "mark", "favicon", "app icon", "square logo"],
    previewUrl: "",
    downloadFiles: [
      { name: "meridian-icon.svg", format: "SVG", url: "#", size: "4 KB" },
      { name: "meridian-icon.png", format: "PNG", url: "#", size: "8 KB" },
    ],
    visibility: "public",
    featured: false,
    isPrimary: false,
    createdAt: "2025-01-15",
    updatedAt: "2025-03-01",
    variants: [
      { name: "Full Color", previewUrl: "", backgroundSuggestion: "any", downloadFiles: [{ name: "icon-color.svg", format: "SVG", url: "#", size: "4 KB" }] },
      { name: "White", previewUrl: "", backgroundSuggestion: "dark", downloadFiles: [{ name: "icon-white.svg", format: "SVG", url: "#", size: "4 KB" }] },
    ],
    minimumSize: "16px",
    clearSpace: "50% of icon width",
  },
  {
    id: "logo-3",
    category: "logos",
    subcategory: "Wordmark",
    title: "Wordmark",
    description: "Text-only wordmark for editorial contexts and minimal layouts.",
    tags: ["wordmark", "text", "editorial", "horizontal", "print", "web"],
    usageNotes: "Preferred for inline editorial use or when paired with partner logos.",
    searchPhrases: ["wordmark", "text logo", "type logo", "name only"],
    previewUrl: "",
    downloadFiles: [
      { name: "meridian-wordmark.svg", format: "SVG", url: "#", size: "6 KB" },
      { name: "meridian-wordmark.png", format: "PNG", url: "#", size: "15 KB" },
    ],
    visibility: "public",
    featured: false,
    isPrimary: false,
    createdAt: "2025-01-15",
    updatedAt: "2025-03-01",
    variants: [
      { name: "Dark", previewUrl: "", backgroundSuggestion: "light", downloadFiles: [{ name: "wordmark-dark.svg", format: "SVG", url: "#", size: "6 KB" }] },
      { name: "White", previewUrl: "", backgroundSuggestion: "dark", downloadFiles: [{ name: "wordmark-white.svg", format: "SVG", url: "#", size: "6 KB" }] },
    ],
    minimumSize: "100px wide",
    clearSpace: "Cap height on all sides",
  },
];

const demoAssets: BrandAsset[] = [
  { id: "img-1", category: "images", subcategory: "Team", title: "Team Collaboration", description: "Team working together in modern office environment.", tags: ["team", "office", "collaboration", "people", "lifestyle"], usageNotes: "Approved for internal presentations and careers pages.", searchPhrases: ["team photo", "office", "people working"], previewUrl: "", downloadFiles: [{ name: "team-collab.jpg", format: "JPG", url: "#", size: "2.4 MB" }], visibility: "public", featured: true, isPrimary: false, createdAt: "2025-02-10", updatedAt: "2025-02-10" },
  { id: "img-2", category: "images", subcategory: "Product", title: "Dashboard Interface", description: "Product screenshot showing the main dashboard view.", tags: ["product", "screenshot", "dashboard", "interface", "ui"], usageNotes: "Current as of v3.2. Use for marketing materials and sales decks.", searchPhrases: ["product shot", "app screenshot", "interface"], previewUrl: "", downloadFiles: [{ name: "dashboard-screenshot.png", format: "PNG", url: "#", size: "1.8 MB" }], visibility: "public", featured: true, isPrimary: false, createdAt: "2025-03-01", updatedAt: "2025-03-01" },
  { id: "img-3", category: "images", subcategory: "Event", title: "Conference Keynote", description: "CEO presenting at annual conference keynote.", tags: ["event", "conference", "keynote", "speaking", "leadership"], usageNotes: "Approved for press and social media.", searchPhrases: ["event photo", "conference", "keynote"], previewUrl: "", downloadFiles: [{ name: "conference-keynote.jpg", format: "JPG", url: "#", size: "3.1 MB" }], visibility: "public", featured: false, isPrimary: false, createdAt: "2025-01-20", updatedAt: "2025-01-20" },
  { id: "art-1", category: "artwork", subcategory: "Illustrations", title: "Brand Illustration Set", description: "Custom illustrations used across the product and marketing.", tags: ["illustration", "custom", "marketing", "web", "product"], usageNotes: "Vector source available. Contact design team for custom variations.", searchPhrases: ["illustrations", "custom art", "brand artwork"], previewUrl: "", downloadFiles: [{ name: "illustrations.zip", format: "ZIP", url: "#", size: "5.6 MB" }], visibility: "public", featured: true, isPrimary: false, createdAt: "2025-02-15", updatedAt: "2025-02-15" },
  { id: "art-2", category: "artwork", subcategory: "Patterns", title: "Brand Pattern", description: "Geometric pattern using the brand's visual language.", tags: ["pattern", "geometric", "background", "texture", "decorative"], usageNotes: "Use at 10-20% opacity as a background texture.", searchPhrases: ["pattern", "background texture", "geometric"], previewUrl: "", downloadFiles: [{ name: "brand-pattern.svg", format: "SVG", url: "#", size: "24 KB" }, { name: "brand-pattern.png", format: "PNG", url: "#", size: "450 KB" }], visibility: "public", featured: false, isPrimary: false, createdAt: "2025-01-10", updatedAt: "2025-01-10" },
  { id: "art-3", category: "artwork", subcategory: "Social Media", title: "Social Media Templates", description: "Pre-designed social media post templates for Instagram, LinkedIn, and Twitter.", tags: ["social", "template", "instagram", "linkedin", "twitter", "social media"], usageNotes: "Editable in Figma. Maintain brand colors and typography.", searchPhrases: ["social media", "instagram post", "linkedin graphic", "social templates"], previewUrl: "", downloadFiles: [{ name: "social-templates.zip", format: "ZIP", url: "#", size: "12 MB" }], visibility: "public", featured: true, isPrimary: false, createdAt: "2025-03-05", updatedAt: "2025-03-05" },
  { id: "icon-1", category: "icons", subcategory: "UI Icons", title: "Product Icon Set", description: "Full set of product UI icons in the Meridian style.", tags: ["icons", "ui", "product", "interface", "navigation"], usageNotes: "Use 24px for standard UI, 16px for compact views. Maintain 2px stroke weight.", searchPhrases: ["icons", "ui icons", "product icons"], previewUrl: "", downloadFiles: [{ name: "icons-svg.zip", format: "ZIP", url: "#", size: "180 KB" }], visibility: "public", featured: false, isPrimary: false, createdAt: "2025-02-01", updatedAt: "2025-02-01" },
  { id: "icon-2", category: "icons", subcategory: "Social Icons", title: "Social Platform Icons", description: "Brand-styled social media platform icons.", tags: ["social", "icons", "platforms", "twitter", "linkedin", "instagram", "social media"], usageNotes: "Use for social links in footers, emails, and presentations.", searchPhrases: ["social icons", "social media icons", "platform icons"], previewUrl: "", downloadFiles: [{ name: "social-icons.zip", format: "ZIP", url: "#", size: "45 KB" }], visibility: "public", featured: false, isPrimary: false, createdAt: "2025-01-15", updatedAt: "2025-01-15" },
];

const demoGuidelines: GuidelineModule[] = [
  { id: "gl-1", title: "Brand Overview", slug: "overview", order: 1, type: "overview", content: "Meridian is a design-forward technology brand. Our visual identity communicates precision, innovation, and human warmth. Every touchpoint should feel considered, premium, and unmistakably Meridian.\n\nOur brand pillars:\n• **Precision** — Every detail is intentional\n• **Innovation** — Forward-thinking and modern\n• **Warmth** — Human, approachable, trustworthy\n• **Clarity** — Simple, clear, no unnecessary complexity" },
  { id: "gl-2", title: "Mission & Values", slug: "mission", order: 2, type: "overview", content: "**Mission:** To empower teams with tools that make complex work feel simple.\n\n**Vision:** A world where technology adapts to people, not the other way around.\n\n**Values:**\n• **Craft** — We obsess over details\n• **Empathy** — We build for real humans\n• **Boldness** — We take thoughtful risks\n• **Transparency** — We communicate openly" },
  { id: "gl-3", title: "Logo Usage", slug: "logo-usage", order: 3, type: "usage", content: "**Primary Logo:** Use the full-color primary logo on white or light backgrounds. Maintain minimum clear space equal to the height of the M icon.\n\n**Dark Backgrounds:** Use the white logo variant. Never place the dark logo on dark backgrounds.\n\n**Minimum Size:** 120px wide for digital, 1 inch for print.\n\n**Do Not:**\n• Stretch, rotate, or distort the logo\n• Change the logo colors\n• Add effects like shadows or outlines\n• Place on busy or low-contrast backgrounds\n• Recreate the logo in a different typeface" },
  { id: "gl-4", title: "Color Usage", slug: "color-usage", order: 4, type: "usage", content: "**Primary Palette:** Midnight (#1a1a2e) and Indigo (#6366f1) form the core identity. Use Midnight for headings and Indigo for interactive elements.\n\n**Secondary Palette:** Violet and Soft Lavender provide supporting accents. Use sparingly for gradients and highlights.\n\n**Neutrals:** The Slate scale provides text hierarchy and structural elements.\n\n**Semantic Colors:** Emerald (success), Amber (warning), and Rose (error) are reserved for status indicators only.\n\n**Rules:**\n• Never use semantic colors for decorative purposes\n• Maintain minimum 4.5:1 contrast ratio for text\n• Indigo is the only color for links and CTAs" },
  { id: "gl-5", title: "Typography Usage", slug: "typography-usage", order: 5, type: "usage", content: "**Cabinet Grotesk:** Headlines and display text. Use weights 700-800 for emphasis. Never below 18px.\n\n**Satoshi:** All body text, UI labels, buttons, and captions. Weight 400 for body, 500 for labels and buttons, 700 for bold emphasis.\n\n**JetBrains Mono:** Code blocks and technical data only.\n\n**Hierarchy:**\n• H1: Cabinet Grotesk 800, 36px\n• H2: Cabinet Grotesk 700, 28px\n• H3: Cabinet Grotesk 700, 22px\n• Body: Satoshi 400, 16px\n• Caption: Satoshi 400, 14px\n• Small: Satoshi 500, 12px" },
  { id: "gl-6", title: "Tone of Voice", slug: "tone", order: 6, type: "usage", content: "**We are:** Confident, clear, warm, precise, human\n**We are not:** Corporate jargon, overly casual, condescending, vague\n\n**Guidelines:**\n• Write like you're talking to a smart colleague\n• Be specific — say exactly what you mean\n• Use active voice\n• Keep sentences short and purposeful\n• Lead with the most important information\n• Use contractions naturally (we're, it's, you'll)\n\n**Examples:**\n✓ \"Your report is ready to download.\"\n✗ \"The generation of your report has been completed successfully.\"\n\n✓ \"Something went wrong. Try again in a few minutes.\"\n✗ \"An unexpected error has occurred. Please contact support.\"" },
  { id: "gl-7", title: "Do's and Don'ts", slug: "dos-donts", order: 7, type: "dos-donts", content: "**Do:**\n• Use the approved color palette consistently\n• Maintain generous whitespace\n• Use the type hierarchy as documented\n• Keep layouts clean and organized\n• Use high-quality imagery\n• Maintain brand consistency across all touchpoints\n\n**Don't:**\n• Use off-brand colors or gradients\n• Crowd elements together\n• Use more than 2 typefaces in one design\n• Stretch, skew, or modify the logo\n• Use low-resolution images\n• Mix brand styles from different periods\n• Add decorative elements that serve no purpose" },
];

// ── Search helpers ──

function getAllSearchableItems(
  assets: BrandAsset[],
  logos: LogoAsset[],
  colors: BrandColor[],
  gradients: BrandGradient[],
  typography: TypographyEntry[],
  guidelines: GuidelineModule[]
): SearchResult[] {
  const results: SearchResult[] = [];

  logos.forEach((l) => {
    results.push({ type: "asset", id: l.id, title: l.title, description: l.description, previewUrl: l.previewUrl, category: "logos", relevance: 0, downloadFiles: l.downloadFiles });
  });

  assets.forEach((a) => {
    results.push({ type: "asset", id: a.id, title: a.title, description: a.description, previewUrl: a.previewUrl, category: a.category, relevance: 0, downloadFiles: a.downloadFiles });
  });

  colors.forEach((c) => {
    results.push({ type: "color", id: c.id, title: c.name, description: `${c.description} HEX: ${c.hex} | RGB: ${c.rgb}`, previewUrl: "", category: "colors", relevance: 0 });
  });

  gradients.forEach((g) => {
    results.push({ type: "gradient", id: g.id, title: g.name, description: g.description, previewUrl: "", category: "gradients", relevance: 0 });
  });

  typography.forEach((t) => {
    results.push({ type: "typography", id: t.id, title: t.familyName, description: `${t.role}. ${t.usageDescription}`, previewUrl: "", category: "typography", relevance: 0 });
  });

  guidelines.forEach((g) => {
    results.push({ type: "guideline", id: g.id, title: g.title, description: g.content.substring(0, 200), previewUrl: "", category: "guidelines", relevance: 0 });
  });

  return results;
}

function scoreResult(result: SearchResult, queryTerms: string[]): number {
  let score = 0;
  const titleLower = result.title.toLowerCase();
  const descLower = result.description.toLowerCase();
  const catLower = result.category.toLowerCase();

  for (const term of queryTerms) {
    if (titleLower.includes(term)) score += 10;
    if (catLower.includes(term)) score += 8;
    if (descLower.includes(term)) score += 3;
  }

  return score;
}

const synonyms: Record<string, string[]> = {
  logo: ["logo", "logos", "mark", "wordmark", "icon"],
  font: ["font", "typography", "typeface", "type"],
  color: ["color", "colours", "palette", "swatch", "hex", "rgb"],
  gradient: ["gradient", "gradients"],
  image: ["image", "images", "photo", "photography"],
  icon: ["icon", "icons"],
  artwork: ["artwork", "illustration", "pattern", "art"],
  guideline: ["guideline", "guidelines", "rules", "usage", "brand"],
  primary: ["primary", "main", "default"],
  dark: ["dark", "night", "black"],
  light: ["light", "white"],
  social: ["social", "instagram", "linkedin", "twitter", "facebook"],
  presentation: ["presentation", "deck", "slides", "ppt"],
  web: ["web", "website", "digital", "online"],
  print: ["print", "printed", "paper"],
  blue: ["blue", "indigo"],
  download: ["download", "get", "grab"],
};

function expandTerms(queryTerms: string[]): string[] {
  const expanded = new Set(queryTerms);
  for (const term of queryTerms) {
    for (const [key, syns] of Object.entries(synonyms)) {
      if (syns.includes(term) || key === term) {
        syns.forEach((s) => expanded.add(s));
      }
    }
  }
  return Array.from(expanded);
}

// ── Storage implementation ──

const DEMO_USER_ID = "user-demo";
const DEMO_HUB_ID = "hub-meridian";

export class MemStorage implements IStorage {
  private userAccounts: Map<string, UserAccount> = new Map();
  private hubs: Map<string, BrandHub> = new Map();

  // Hub-scoped data maps
  private hubColors: Map<string, BrandColor[]> = new Map();
  private hubGradients: Map<string, BrandGradient[]> = new Map();
  private hubTypography: Map<string, TypographyEntry[]> = new Map();
  private hubLogos: Map<string, LogoAsset[]> = new Map();
  private hubAssets: Map<string, BrandAsset[]> = new Map();
  private hubGuidelines: Map<string, GuidelineModule[]> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Create demo user
    const demoUser: UserAccount = {
      id: DEMO_USER_ID,
      email: "demo@brandhub.com",
      name: "Demo User",
      passwordHash: "demo123",
      createdAt: new Date().toISOString(),
    };
    this.userAccounts.set(demoUser.id, demoUser);

    // Create demo hub
    const now = new Date().toISOString();
    const demoHub: BrandHub = {
      id: DEMO_HUB_ID,
      ownerId: DEMO_USER_ID,
      name: "Meridian",
      slug: "meridian",
      description: "Design-forward technology brand",
      logoUrl: "",
      primaryColor: "#6366f1",
      accentColor: "#8b5cf6",
      heroHeading: "Your brand, all in one place",
      heroSubheading: "Search, preview, and download every approved brand asset. Powered by an AI brand assistant that finds exactly what you need.",
      published: true,
      createdAt: now,
      updatedAt: now,
    };
    this.hubs.set(demoHub.id, demoHub);

    // Seed hub data
    this.hubColors.set(DEMO_HUB_ID, [...demoColors]);
    this.hubGradients.set(DEMO_HUB_ID, [...demoGradients]);
    this.hubTypography.set(DEMO_HUB_ID, [...demoTypography]);
    this.hubLogos.set(DEMO_HUB_ID, [...demoLogos]);
    this.hubAssets.set(DEMO_HUB_ID, [...demoAssets]);
    this.hubGuidelines.set(DEMO_HUB_ID, [...demoGuidelines]);
  }

  // ── Auth ──

  async getUserByEmail(email: string): Promise<UserAccount | undefined> {
    return Array.from(this.userAccounts.values()).find((u) => u.email === email);
  }

  async getUserById(id: string): Promise<UserAccount | undefined> {
    return this.userAccounts.get(id);
  }

  async getUserByGoogleId(googleId: string): Promise<UserAccount | undefined> {
    return Array.from(this.userAccounts.values()).find((u) => u.googleId === googleId);
  }

  async createUserAccount(data: { email: string; name: string; passwordHash: string; googleId?: string; avatarUrl?: string }): Promise<UserAccount> {
    const user: UserAccount = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
      googleId: data.googleId,
      avatarUrl: data.avatarUrl,
      createdAt: new Date().toISOString(),
    };
    this.userAccounts.set(user.id, user);
    return user;
  }

  // ── Hub CRUD ──

  async getHubsByOwner(ownerId: string): Promise<BrandHub[]> {
    return Array.from(this.hubs.values()).filter((h) => h.ownerId === ownerId);
  }

  async getHubBySlug(slug: string): Promise<BrandHub | undefined> {
    return Array.from(this.hubs.values()).find((h) => h.slug === slug);
  }

  async getHubById(id: string): Promise<BrandHub | undefined> {
    return this.hubs.get(id);
  }

  async createHub(data: Omit<BrandHub, "id" | "createdAt" | "updatedAt">): Promise<BrandHub> {
    const now = new Date().toISOString();
    const hub: BrandHub = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.hubs.set(hub.id, hub);
    // Initialize empty data arrays
    this.hubColors.set(hub.id, []);
    this.hubGradients.set(hub.id, []);
    this.hubTypography.set(hub.id, []);
    this.hubLogos.set(hub.id, []);
    this.hubAssets.set(hub.id, []);
    this.hubGuidelines.set(hub.id, []);
    return hub;
  }

  async updateHub(id: string, data: Partial<BrandHub>): Promise<BrandHub> {
    const hub = this.hubs.get(id);
    if (!hub) throw new Error("Hub not found");
    const updated = { ...hub, ...data, id, updatedAt: new Date().toISOString() };
    this.hubs.set(id, updated);
    return updated;
  }

  async deleteHub(id: string): Promise<void> {
    this.hubs.delete(id);
    this.hubColors.delete(id);
    this.hubGradients.delete(id);
    this.hubTypography.delete(id);
    this.hubLogos.delete(id);
    this.hubAssets.delete(id);
    this.hubGuidelines.delete(id);
  }

  // ── Hub-scoped data ──

  getHubColors(hubId: string): BrandColor[] {
    return this.hubColors.get(hubId) || [];
  }
  addHubColor(hubId: string, color: BrandColor): void {
    const arr = this.hubColors.get(hubId) || [];
    arr.push(color);
    this.hubColors.set(hubId, arr);
  }
  removeHubColor(hubId: string, colorId: string): void {
    const arr = this.hubColors.get(hubId) || [];
    this.hubColors.set(hubId, arr.filter((c) => c.id !== colorId));
  }

  getHubGradients(hubId: string): BrandGradient[] {
    return this.hubGradients.get(hubId) || [];
  }
  addHubGradient(hubId: string, gradient: BrandGradient): void {
    const arr = this.hubGradients.get(hubId) || [];
    arr.push(gradient);
    this.hubGradients.set(hubId, arr);
  }
  removeHubGradient(hubId: string, gradientId: string): void {
    const arr = this.hubGradients.get(hubId) || [];
    this.hubGradients.set(hubId, arr.filter((g) => g.id !== gradientId));
  }

  getHubTypography(hubId: string): TypographyEntry[] {
    return this.hubTypography.get(hubId) || [];
  }
  addHubTypography(hubId: string, entry: TypographyEntry): void {
    const arr = this.hubTypography.get(hubId) || [];
    arr.push(entry);
    this.hubTypography.set(hubId, arr);
  }
  removeHubTypography(hubId: string, entryId: string): void {
    const arr = this.hubTypography.get(hubId) || [];
    this.hubTypography.set(hubId, arr.filter((t) => t.id !== entryId));
  }

  getHubLogos(hubId: string): LogoAsset[] {
    return this.hubLogos.get(hubId) || [];
  }
  addHubLogo(hubId: string, logo: LogoAsset): void {
    const arr = this.hubLogos.get(hubId) || [];
    arr.push(logo);
    this.hubLogos.set(hubId, arr);
  }
  removeHubLogo(hubId: string, logoId: string): void {
    const arr = this.hubLogos.get(hubId) || [];
    this.hubLogos.set(hubId, arr.filter((l) => l.id !== logoId));
  }

  getHubAssets(hubId: string, category?: string): BrandAsset[] {
    const assets = this.hubAssets.get(hubId) || [];
    const logos = this.hubLogos.get(hubId) || [];
    const all: BrandAsset[] = [...assets, ...logos];
    if (!category) return all;
    if (category === "logos") return logos;
    return assets.filter((a) => a.category === category);
  }
  addHubAsset(hubId: string, asset: BrandAsset): void {
    const arr = this.hubAssets.get(hubId) || [];
    arr.push(asset);
    this.hubAssets.set(hubId, arr);
  }
  removeHubAsset(hubId: string, assetId: string): void {
    const arr = this.hubAssets.get(hubId) || [];
    this.hubAssets.set(hubId, arr.filter((a) => a.id !== assetId));
  }

  getHubGuidelines(hubId: string): GuidelineModule[] {
    return (this.hubGuidelines.get(hubId) || []).sort((a, b) => a.order - b.order);
  }
  addHubGuideline(hubId: string, guideline: GuidelineModule): void {
    const arr = this.hubGuidelines.get(hubId) || [];
    arr.push(guideline);
    this.hubGuidelines.set(hubId, arr);
  }
  removeHubGuideline(hubId: string, guidelineId: string): void {
    const arr = this.hubGuidelines.get(hubId) || [];
    this.hubGuidelines.set(hubId, arr.filter((g) => g.id !== guidelineId));
  }

  getHubFeaturedAssets(hubId: string): BrandAsset[] {
    const assets = this.hubAssets.get(hubId) || [];
    const logos = this.hubLogos.get(hubId) || [];
    return [...assets, ...logos].filter((a) => a.featured);
  }

  searchHubAssets(hubId: string, query: string): SearchResult[] {
    const assets = this.hubAssets.get(hubId) || [];
    const logos = this.hubLogos.get(hubId) || [];
    const colors = this.hubColors.get(hubId) || [];
    const gradients = this.hubGradients.get(hubId) || [];
    const typography = this.hubTypography.get(hubId) || [];
    const guidelines = this.hubGuidelines.get(hubId) || [];

    const allSearchable = getAllSearchableItems(assets, logos, colors, gradients, typography, guidelines);

    const queryTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1);

    const expanded = expandTerms(queryTerms);

    const scored = allSearchable.map((r) => ({
      ...r,
      relevance: scoreResult(r, expanded),
    }));

    return scored
      .filter((r) => r.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 12);
  }
}

export const storage = new MemStorage();
