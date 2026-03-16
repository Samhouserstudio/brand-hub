import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { LogoAsset } from "@shared/schema";

const backgrounds = [
  { label: "White", value: "white", className: "bg-white" },
  { label: "Light Gray", value: "gray", className: "bg-gray-100 dark:bg-gray-200" },
  { label: "Dark", value: "dark", className: "bg-slate-800" },
  { label: "Black", value: "black", className: "bg-black" },
  { label: "Transparency", value: "checker", className: "bg-checkerboard" },
];

// SVG logos for the demo
function MeridianLogo({ variant, bg }: { variant: string; bg: string }) {
  const isDark = bg === "dark" || bg === "black";
  const textColor = isDark ? "white" : "#1a1a2e";
  const accentColor = "#6366f1";

  if (variant === "Icon Mark" || variant === "Full Color" && false) {
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect x="4" y="4" width="52" height="52" rx="12" fill={accentColor} />
        <text x="30" y="38" textAnchor="middle" fill="white" fontSize="28" fontWeight="800" fontFamily="sans-serif">M</text>
      </svg>
    );
  }

  if (variant === "White") {
    return (
      <svg width="180" height="48" viewBox="0 0 180 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="10" fill="white" />
        <text x="24" y="32" textAnchor="middle" fill={accentColor} fontSize="22" fontWeight="800" fontFamily="sans-serif">M</text>
        <text x="56" y="32" fill="white" fontSize="22" fontWeight="700" fontFamily="sans-serif">Meridian</text>
      </svg>
    );
  }

  if (variant === "Dark") {
    return (
      <svg width="180" height="48" viewBox="0 0 180 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="10" fill="#1a1a2e" />
        <text x="24" y="32" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="sans-serif">M</text>
        <text x="56" y="32" fill="#1a1a2e" fontSize="22" fontWeight="700" fontFamily="sans-serif">Meridian</text>
      </svg>
    );
  }

  // Default / Full Color
  return (
    <svg width="180" height="48" viewBox="0 0 180 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="10" fill={accentColor} />
      <text x="24" y="32" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="sans-serif">M</text>
      <text x="56" y="32" fill={textColor} fontSize="22" fontWeight="700" fontFamily="sans-serif">Meridian</text>
    </svg>
  );
}

function IconMark({ bg }: { bg: string }) {
  const isDark = bg === "dark" || bg === "black";
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#6366f1" />
      <text x="32" y="42" textAnchor="middle" fill="white" fontSize="32" fontWeight="800" fontFamily="sans-serif">M</text>
    </svg>
  );
}

function Wordmark({ bg }: { bg: string }) {
  const isDark = bg === "dark" || bg === "black";
  const color = isDark ? "white" : "#1a1a2e";
  return (
    <svg width="160" height="40" viewBox="0 0 160 40" fill="none">
      <text x="0" y="30" fill={color} fontSize="28" fontWeight="800" fontFamily="sans-serif" letterSpacing="-0.5">Meridian</text>
    </svg>
  );
}

export default function LogosPage() {
  const { data: logos, isLoading } = useQuery<LogoAsset[]>({ queryKey: ["/api/logos"] });
  const [activeBg, setActiveBg] = useState("white");

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-logos">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Logos
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          All approved logo variations. Toggle backgrounds to preview on different surfaces.
        </p>
      </div>

      {/* Background Toggle */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium mr-1">Preview on:</span>
        {backgrounds.map((bg) => (
          <button
            key={bg.value}
            onClick={() => setActiveBg(bg.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              activeBg === bg.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            }`}
            data-testid={`bg-toggle-${bg.value}`}
          >
            <div className={`w-3.5 h-3.5 rounded-sm border border-border/50 ${bg.className}`} />
            {bg.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {logos?.map((logo) => (
            <LogoCard key={logo.id} logo={logo} activeBg={activeBg} />
          ))}
        </div>
      )}
    </div>
  );
}

function LogoCard({ logo, activeBg }: { logo: LogoAsset; activeBg: string }) {
  const bgClass = backgrounds.find((b) => b.value === activeBg)?.className || "bg-white";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" data-testid={`logo-card-${logo.id}`}>
      {/* Preview */}
      <div className={`flex items-center justify-center h-40 ${bgClass} transition-colors`}>
        {logo.id === "logo-1" && <MeridianLogo variant="Full Color" bg={activeBg} />}
        {logo.id === "logo-2" && <IconMark bg={activeBg} />}
        {logo.id === "logo-3" && <Wordmark bg={activeBg} />}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="text-sm font-semibold">{logo.title}</h3>
          {logo.isPrimary && <Badge variant="secondary" className="text-[10px]">Primary</Badge>}
        </div>
        <p className="text-xs text-muted-foreground mb-3">{logo.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {logo.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
          ))}
        </div>

        {/* Usage note */}
        {logo.usageNotes && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 mb-3">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">{logo.usageNotes}</p>
          </div>
        )}

        {/* Downloads */}
        <div className="flex flex-wrap gap-1.5">
          {logo.downloadFiles.map((file) => (
            <Button key={file.name} variant="secondary" size="sm" className="text-xs gap-1.5" data-testid={`download-${file.name}`}>
              <Download className="w-3 h-3" />
              {file.format}
              <span className="text-muted-foreground">({file.size})</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
