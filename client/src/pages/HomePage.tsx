import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AISearch from "@/components/AISearch";
import {
  Hexagon,
  Palette,
  Type,
  Image,
  Sparkles,
  Shapes,
  BookOpen,
  Download,
  ArrowRight,
} from "lucide-react";
import type { BrandAsset } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface HomePageProps {
  slug: string;
}

export default function HomePage({ slug }: HomePageProps) {
  const base = `/hub/${slug}`;
  const categories = [
    { label: "Logos", href: `${base}/logos`, icon: Hexagon, description: "Primary, secondary, and icon marks", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
    { label: "Colors", href: `${base}/colors`, icon: Palette, description: "Palette, swatches, and gradients", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    { label: "Typography", href: `${base}/typography`, icon: Type, description: "Fonts, hierarchy, and specimens", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    { label: "Images", href: `${base}/images`, icon: Image, description: "Photography and approved visuals", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { label: "Artwork", href: `${base}/artwork`, icon: Sparkles, description: "Illustrations, patterns, templates", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { label: "Icons", href: `${base}/icons`, icon: Shapes, description: "UI and social media icon sets", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    { label: "Guidelines", href: `${base}/guidelines`, icon: BookOpen, description: "Brand rules and usage guide", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  ];

  const { data: featured, isLoading } = useQuery<BrandAsset[]>({
    queryKey: [`/api/public/${slug}/featured`],
  });

  return (
    <div data-testid="page-home">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            AI-powered brand assistant
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-3" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Your brand, all in one place
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Search, preview, and download every approved brand asset. Powered by an AI assistant that finds exactly what you need.
          </p>

          <AISearch variant="hero" slug={slug} />
        </div>
      </section>

      {/* Category Grid */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Browse by category
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative flex flex-col gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
              data-testid={`category-${cat.label.toLowerCase()}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.color}`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{cat.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
              </div>
              <ArrowRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Assets */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Featured assets
          </h2>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured?.map((asset) => (
              <FeaturedAssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedAssetCard({ asset }: { asset: BrandAsset }) {
  return (
    <div
      className="group relative flex flex-col p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
      data-testid={`featured-asset-${asset.id}`}
    >
      {/* Preview area */}
      <div className="h-24 rounded-lg bg-muted/50 flex items-center justify-center mb-3 overflow-hidden">
        {asset.category === "logos" ? (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/10 to-violet-500/10">
            <svg width="80" height="32" viewBox="0 0 120 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="8" fill="hsl(var(--primary))" opacity="0.9"/>
              <text x="20" y="26" textAnchor="middle" fill="white" fontSize="18" fontWeight="800">M</text>
              <text x="50" y="28" fill="currentColor" fontSize="20" fontWeight="700" className="text-foreground">Meridian</text>
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground/30">
            <Image className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold truncate">{asset.title}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0 capitalize">
            {asset.category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
      </div>

      {asset.downloadFiles && asset.downloadFiles.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60">
          <Download className="w-3 h-3 text-muted-foreground" />
          <div className="flex gap-1 flex-wrap">
            {asset.downloadFiles.map((f) => (
              <span key={f.name} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {f.format}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
