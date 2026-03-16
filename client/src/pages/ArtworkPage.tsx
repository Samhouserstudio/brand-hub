import { useQuery } from "@tanstack/react-query";
import { Download, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BrandAsset } from "@shared/schema";

interface ArtworkPageProps {
  slug: string;
}

export default function ArtworkPage({ slug }: ArtworkPageProps) {
  const { data: assets, isLoading } = useQuery<BrandAsset[]>({
    queryKey: [`/api/public/${slug}/assets?category=artwork`],
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-artwork">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Artwork
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Illustrations, patterns, textures, social templates, and decorative assets.
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets?.map((asset) => (
            <div key={asset.id} className="rounded-xl border border-border bg-card overflow-hidden" data-testid={`artwork-card-${asset.id}`}>
              <div className="h-40 bg-gradient-to-br from-primary/10 via-violet-500/10 to-pink-500/10 flex items-center justify-center">
                {asset.subcategory === "Patterns" ? (
                  <div className="w-full h-full opacity-20" style={{
                    backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 50%)",
                    backgroundSize: "16px 16px",
                  }} />
                ) : asset.subcategory === "Social Media" ? (
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/30 to-violet-500/30 border border-border/30" />
                    ))}
                  </div>
                ) : (
                  <Sparkles className="w-10 h-10 text-primary/30" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">{asset.title}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{asset.subcategory}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{asset.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {asset.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {asset.downloadFiles.map((f) => (
                    <Button key={f.name} variant="secondary" size="sm" className="text-xs gap-1">
                      <Download className="w-3 h-3" />{f.format} ({f.size})
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
