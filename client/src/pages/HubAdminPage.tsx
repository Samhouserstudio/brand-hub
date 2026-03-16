import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import {
  Hexagon, ArrowLeft, Globe, Lock, Palette, Type, Image, BookOpen,
  Trash2, Plus, Settings, Copy, Check, ExternalLink, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type {
  BrandHub, BrandColor, BrandGradient, TypographyEntry,
  LogoAsset, BrandAsset, GuidelineModule,
} from "@shared/schema";

interface HubAdminPageProps {
  slug: string;
}

export default function HubAdminPage({ slug }: HubAdminPageProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const { data: hubs } = useQuery<BrandHub[]>({ queryKey: ["/api/hubs"] });
  const hub = hubs?.find((h) => h.slug === slug);

  const { data: colors = [] } = useQuery<BrandColor[]>({
    queryKey: [`/api/hubs/${hub?.id}/colors`],
    enabled: !!hub,
  });
  const { data: gradients = [] } = useQuery<BrandGradient[]>({
    queryKey: [`/api/hubs/${hub?.id}/gradients`],
    enabled: !!hub,
  });
  const { data: typography = [] } = useQuery<TypographyEntry[]>({
    queryKey: [`/api/hubs/${hub?.id}/typography`],
    enabled: !!hub,
  });
  const { data: logos = [] } = useQuery<LogoAsset[]>({
    queryKey: [`/api/hubs/${hub?.id}/logos`],
    enabled: !!hub,
  });
  const { data: guidelines = [] } = useQuery<GuidelineModule[]>({
    queryKey: [`/api/hubs/${hub?.id}/guidelines`],
    enabled: !!hub,
  });
  const { data: assets = [] } = useQuery<BrandAsset[]>({
    queryKey: [`/api/hubs/${hub?.id}/assets`],
    enabled: !!hub,
  });

  if (!hubs) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!hub) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground gap-4">
        <p>Hub not found</p>
        <Link href="/dashboard"><Button variant="outline" size="sm">Back to Dashboard</Button></Link>
      </div>
    );
  }

  const publicUrl = `/#/hub/${hub.slug}`;

  async function togglePublish() {
    await apiRequest("PATCH", `/api/hubs/${hub!.id}`, { published: !hub!.published });
    queryClient.invalidateQueries({ queryKey: ["/api/hubs"] });
  }

  function copyUrl() {
    navigator.clipboard.writeText(window.location.origin + publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function deleteHub() {
    if (!confirm(`Delete "${hub!.name}"? This cannot be undone.`)) return;
    await apiRequest("DELETE", `/api/hubs/${hub!.id}`);
    queryClient.invalidateQueries({ queryKey: ["/api/hubs"] });
    setLocation("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: hub.primaryColor }}
              >
                {hub.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold">{hub.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={hub.published ? "default" : "secondary"} className="text-[10px]">
              {hub.published ? <><Globe className="w-3 h-3 mr-1" /> Published</> : <><Lock className="w-3 h-3 mr-1" /> Draft</>}
            </Badge>
            <Button variant="outline" size="sm" onClick={togglePublish}>
              {hub.published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Public URL */}
        {hub.published && (
          <div className="flex items-center gap-2 mb-6 p-3 rounded-lg border border-border bg-muted/30">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Public URL:</span>
            <code className="text-xs font-mono flex-1 truncate">{window.location.origin + publicUrl}</code>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={copyUrl}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Link href={`/hub/${hub.slug}`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                <ExternalLink className="w-3 h-3" /> Open
              </Button>
            </Link>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="colors">Colors ({colors.length})</TabsTrigger>
            <TabsTrigger value="gradients">Gradients ({gradients.length})</TabsTrigger>
            <TabsTrigger value="typography">Typography ({typography.length})</TabsTrigger>
            <TabsTrigger value="logos">Logos ({logos.length})</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines ({guidelines.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{colors.length}</p>
                  <p className="text-xs text-muted-foreground">Colors</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{typography.length}</p>
                  <p className="text-xs text-muted-foreground">Font Families</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{logos.length + assets.length}</p>
                  <p className="text-xs text-muted-foreground">Total Assets</p>
                </CardContent>
              </Card>
            </div>
            <Card className="border-border">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-2">Hub Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{hub.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Slug</dt>
                    <dd className="font-mono text-xs">{hub.slug}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>{hub.published ? "Published" : "Draft"}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground">Colors</dt>
                    <dd className="flex gap-1">
                      <span className="w-4 h-4 rounded" style={{ backgroundColor: hub.primaryColor }} />
                      <span className="w-4 h-4 rounded" style={{ backgroundColor: hub.accentColor }} />
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors */}
          <TabsContent value="colors">
            <AdminColors hubId={hub.id} colors={colors} />
          </TabsContent>

          {/* Gradients */}
          <TabsContent value="gradients">
            <AdminGradients hubId={hub.id} gradients={gradients} />
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography">
            <AdminTypography hubId={hub.id} typography={typography} />
          </TabsContent>

          {/* Logos */}
          <TabsContent value="logos">
            <AdminLogos hubId={hub.id} logos={logos} />
          </TabsContent>

          {/* Guidelines */}
          <TabsContent value="guidelines">
            <AdminGuidelines hubId={hub.id} guidelines={guidelines} />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <HubSettings hub={hub} onDelete={deleteHub} />
          </TabsContent>
        </Tabs>
      </div>

      <PerplexityAttribution />
    </div>
  );
}

// ── Admin Sub-components ──

function AdminColors({ hubId, colors }: { hubId: string; colors: BrandColor[] }) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#000000");
  const [role, setRole] = useState<string>("primary");

  async function addColor(e: React.FormEvent) {
    e.preventDefault();
    const rgb = hexToRgb(hex);
    await apiRequest("POST", `/api/hubs/${hubId}/colors`, {
      name, hex, rgb, role, group: role, cmyk: "", pantone: "", description: "",
    });
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/colors`] });
    setName("");
    setHex("#000000");
  }

  async function removeColor(colorId: string) {
    await apiRequest("DELETE", `/api/hubs/${hubId}/colors/${colorId}`);
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/colors`] });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addColor} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Color name" required className="w-40" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Hex</label>
          <div className="flex gap-1">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-8 h-9 rounded border border-border cursor-pointer" />
            <Input value={hex} onChange={(e) => setHex(e.target.value)} className="w-24 font-mono text-xs" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-9 px-2 rounded border border-border bg-background text-sm">
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="accent">Accent</option>
            <option value="neutral">Neutral</option>
            <option value="semantic">Semantic</option>
          </select>
        </div>
        <Button type="submit" size="sm" className="gap-1"><Plus className="w-3 h-3" /> Add</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: c.hex }} />
            <div>
              <p className="text-xs font-medium">{c.name}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{c.hex}</p>
            </div>
            <button onClick={() => removeColor(c.id)} className="ml-2 text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminGradients({ hubId, gradients }: { hubId: string; gradients: BrandGradient[] }) {
  const [name, setName] = useState("");
  const [css, setCss] = useState("linear-gradient(135deg, #6366f1, #8b5cf6)");

  async function addGradient(e: React.FormEvent) {
    e.preventDefault();
    await apiRequest("POST", `/api/hubs/${hubId}/gradients`, {
      name, css, colors: [], description: "", tags: [],
    });
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/gradients`] });
    setName("");
  }

  async function remove(id: string) {
    await apiRequest("DELETE", `/api/hubs/${hubId}/gradients/${id}`);
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/gradients`] });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addGradient} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Gradient name" required className="w-40" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground block mb-1">CSS</label>
          <Input value={css} onChange={(e) => setCss(e.target.value)} placeholder="linear-gradient(...)" required />
        </div>
        <Button type="submit" size="sm" className="gap-1"><Plus className="w-3 h-3" /> Add</Button>
      </form>

      <div className="grid sm:grid-cols-2 gap-3">
        {gradients.map((g) => (
          <div key={g.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="w-12 h-12 rounded-lg shrink-0" style={{ background: g.css }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">{g.name}</p>
              <p className="text-[10px] font-mono text-muted-foreground truncate">{g.css}</p>
            </div>
            <button onClick={() => remove(g.id)} className="text-muted-foreground hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTypography({ hubId, typography }: { hubId: string; typography: TypographyEntry[] }) {
  const [familyName, setFamilyName] = useState("");
  const [role, setRole] = useState("");
  const [fontUrl, setFontUrl] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await apiRequest("POST", `/api/hubs/${hubId}/typography`, {
      familyName, role, fontUrl, classification: "", weights: [], specimenPreview: "",
      hierarchyExamples: [], usageDescription: "", downloadUrl: "",
    });
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/typography`] });
    setFamilyName("");
    setRole("");
    setFontUrl("");
  }

  async function remove(id: string) {
    await apiRequest("DELETE", `/api/hubs/${hubId}/typography/${id}`);
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/typography`] });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Family Name</label>
          <Input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="e.g. Inter" required className="w-40" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Role</label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Display" required className="w-32" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground block mb-1">Font URL</label>
          <Input value={fontUrl} onChange={(e) => setFontUrl(e.target.value)} placeholder="https://..." />
        </div>
        <Button type="submit" size="sm" className="gap-1"><Plus className="w-3 h-3" /> Add</Button>
      </form>

      <div className="space-y-2">
        {typography.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <span className="text-lg font-bold" style={{ fontFamily: `'${t.familyName}', sans-serif` }}>Aa</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{t.familyName}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
            <button onClick={() => remove(t.id)} className="text-muted-foreground hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLogos({ hubId, logos }: { hubId: string; logos: LogoAsset[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await apiRequest("POST", `/api/hubs/${hubId}/logos`, {
      category: "logos", subcategory: "primary", title, description,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      usageNotes: "", searchPhrases: [], previewUrl: "", downloadFiles: [],
      visibility: "public", featured: false, isPrimary: false,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      variants: [], minimumSize: "", clearSpace: "",
    });
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/logos`] });
    setTitle("");
    setDescription("");
    setTags("");
  }

  async function remove(id: string) {
    await apiRequest("DELETE", `/api/hubs/${hubId}/logos/${id}`);
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/logos`] });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Logo title" required className="w-40" />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground block mb-1">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Tags (comma-separated)</label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="logo, brand" className="w-48" />
        </div>
        <Button type="submit" size="sm" className="gap-1"><Plus className="w-3 h-3" /> Add</Button>
      </form>

      <div className="grid sm:grid-cols-2 gap-3">
        {logos.map((l) => (
          <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <Image className="w-8 h-8 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{l.title}</p>
              <p className="text-xs text-muted-foreground truncate">{l.description}</p>
            </div>
            <button onClick={() => remove(l.id)} className="text-muted-foreground hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminGuidelines({ hubId, guidelines }: { hubId: string; guidelines: GuidelineModule[] }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("overview");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await apiRequest("POST", `/api/hubs/${hubId}/guidelines`, {
      title, slug, content, type, order: guidelines.length,
    });
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/guidelines`] });
    setTitle("");
    setContent("");
  }

  async function remove(id: string) {
    await apiRequest("DELETE", `/api/hubs/${hubId}/guidelines/${id}`);
    queryClient.invalidateQueries({ queryKey: [`/api/hubs/${hubId}/guidelines`] });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="space-y-2">
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Guideline title" required className="w-48" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 px-2 rounded border border-border bg-background text-sm">
              <option value="overview">Overview</option>
              <option value="usage">Usage</option>
              <option value="examples">Examples</option>
              <option value="dos-donts">Dos & Don'ts</option>
            </select>
          </div>
          <Button type="submit" size="sm" className="gap-1"><Plus className="w-3 h-3" /> Add</Button>
        </div>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Guideline content…" rows={3} />
      </form>

      <div className="space-y-2">
        {guidelines.map((g) => (
          <div key={g.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
            <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{g.title}</p>
                <Badge variant="secondary" className="text-[10px]">{g.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.content}</p>
            </div>
            <button onClick={() => remove(g.id)} className="text-muted-foreground hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HubSettings({ hub, onDelete }: { hub: BrandHub; onDelete: () => void }) {
  const [name, setName] = useState(hub.name);
  const [description, setDescription] = useState(hub.description);
  const [heroHeading, setHeroHeading] = useState(hub.heroHeading);
  const [heroSubheading, setHeroSubheading] = useState(hub.heroSubheading);
  const [primaryColor, setPrimaryColor] = useState(hub.primaryColor);
  const [accentColor, setAccentColor] = useState(hub.accentColor);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("PATCH", `/api/hubs/${hub.id}`, {
        name, description, heroHeading, heroSubheading, primaryColor, accentColor,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/hubs"] });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Hub Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Hero Heading</label>
          <Input value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Hero Subheading</label>
          <Input value={heroSubheading} onChange={(e) => setHeroSubheading(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-border" />
              <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-xs" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-border" />
              <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-xs" />
            </div>
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </form>

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Once you delete a hub, there is no going back.
        </p>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Hub
        </Button>
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}
