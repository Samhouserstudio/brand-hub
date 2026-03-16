import { useQuery } from "@tanstack/react-query";
import { Download, Image, Tag, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { BrandAsset } from "@shared/schema";
import { useState } from "react";

export default function ImagesPage() {
  const { data: assets, isLoading } = useQuery<BrandAsset[]>({
    queryKey: ["/api/assets", { category: "images" }],
    queryFn: async () => {
      const res = await fetch("/api/assets?category=images");
      return res.json();
    },
  });

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allTags = assets ? Array.from(new Set(assets.flatMap((a) => a.tags))) : [];
  const filtered = activeTag ? assets?.filter((a) => a.tags.includes(activeTag)) : assets;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-images">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Images
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Approved photography and visual assets for marketing, presentations, and media.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <button
          onClick={() => setActiveTag(null)}
          className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${!activeTag ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${activeTag === tag ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
            data-testid={`filter-tag-${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((asset) => <ImageAssetCard key={asset.id} asset={asset} />)}
        </div>
      )}
    </div>
  );
}

function ImageAssetCard({ asset }: { asset: BrandAsset }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden group" data-testid={`image-card-${asset.id}`}>
      <div className="h-44 bg-gradient-to-br from-muted to-muted/30 flex items-center justify-center relative">
        <Image className="w-10 h-10 text-muted-foreground/20" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
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
        <div className="flex gap-1.5">
          {asset.downloadFiles.map((f) => (
            <Button key={f.name} variant="secondary" size="sm" className="text-xs gap-1">
              <Download className="w-3 h-3" />{f.format} ({f.size})
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
