import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Hexagon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export default function CreateHubPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!slugEdited) {
      setSlug(slugify(val));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/hubs", {
        name,
        slug,
        description,
        primaryColor,
        accentColor,
      });
      const hub = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/hubs"] });
      setLocation(`/hub/${hub.slug}/admin`);
    } catch (err: any) {
      setError(err.message || "Failed to create hub");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Brand Hub
            </span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 sm:px-6 py-10">
        <h1
          className="text-xl font-extrabold tracking-tight mb-1"
          style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
        >
          Create New Brand Hub
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Set up a new brand hub for your organization or project.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand Name</label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Meridian"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Slug <span className="text-muted-foreground/60">(used in the public URL)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">/hub/</span>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugEdited(true);
                }}
                placeholder="meridian"
                required
                maxLength={50}
                pattern="^[a-z0-9-]+$"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-border"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-border"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-border p-5 bg-card">
            <p className="text-xs text-muted-foreground mb-3">Preview</p>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                {name ? name.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{name || "Brand Name"}</h3>
                <p className="text-xs text-muted-foreground">/hub/{slug || "slug"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded" style={{ backgroundColor: primaryColor }} />
              <div className="h-6 w-16 rounded" style={{ backgroundColor: accentColor }} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create Brand Hub"}
          </Button>
        </form>
      </div>

      <PerplexityAttribution />
    </div>
  );
}
