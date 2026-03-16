import { useQuery } from "@tanstack/react-query";
import { Download, Grid3x3, Share2, Heart, Zap, Shield, Bell, Star, Search, Settings, ChevronRight, Mail, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BrandAsset } from "@shared/schema";

const sampleIcons = [
  { icon: Search, label: "Search" },
  { icon: Settings, label: "Settings" },
  { icon: Heart, label: "Heart" },
  { icon: Zap, label: "Zap" },
  { icon: Shield, label: "Shield" },
  { icon: Bell, label: "Bell" },
  { icon: Star, label: "Star" },
  { icon: Share2, label: "Share" },
  { icon: Mail, label: "Mail" },
  { icon: Calendar, label: "Calendar" },
  { icon: Users, label: "Users" },
  { icon: ChevronRight, label: "Arrow" },
];

export default function IconsPage() {
  const { data: assets, isLoading } = useQuery<BrandAsset[]>({
    queryKey: ["/api/assets", { category: "icons" }],
    queryFn: async () => {
      const res = await fetch("/api/assets?category=icons");
      return res.json();
    },
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-icons">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Icons
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Brand-consistent icon sets for product UI and marketing materials.
        </p>
      </div>

      {/* Icon Preview Grid */}
      <div className="mb-10">
        <h2 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Preview</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
          {sampleIcons.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors" data-testid={`icon-preview-${label}`}>
              <Icon className="w-5 h-5 text-foreground" strokeWidth={2} />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download Packs */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {assets?.map((asset) => (
            <div key={asset.id} className="rounded-xl border border-border bg-card p-5" data-testid={`icon-pack-${asset.id}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Grid3x3 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold">{asset.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{asset.subcategory}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{asset.description}</p>
                  {asset.usageNotes && (
                    <p className="text-[11px] text-muted-foreground/80 mb-3 italic">{asset.usageNotes}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {asset.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    {asset.downloadFiles.map((f) => (
                      <Button key={f.name} variant="secondary" size="sm" className="text-xs gap-1">
                        <Download className="w-3 h-3" />{f.format} ({f.size})
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
