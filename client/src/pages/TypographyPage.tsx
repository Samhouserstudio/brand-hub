import { useQuery } from "@tanstack/react-query";
import { Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TypographyEntry } from "@shared/schema";

export default function TypographyPage() {
  const { data: typography, isLoading } = useQuery<TypographyEntry[]>({ queryKey: ["/api/typography"] });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-typography">
      <div className="mb-10">
        <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Typography
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          The type system that defines the Meridian voice. Each font serves a specific role in the hierarchy.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-10">
          {typography?.map((entry) => <TypeCard key={entry.id} entry={entry} />)}
        </div>
      )}
    </div>
  );
}

function TypeCard({ entry }: { entry: TypographyEntry }) {
  const fontFamily = entry.familyName === "Cabinet Grotesk"
    ? "'Cabinet Grotesk', sans-serif"
    : entry.familyName === "JetBrains Mono"
    ? "'JetBrains Mono', monospace"
    : `'${entry.familyName}', sans-serif`;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" data-testid={`type-card-${entry.id}`}>
      {/* Header specimen */}
      <div className="p-6 sm:p-8 bg-muted/30">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            {entry.familyName}
          </h2>
          <Badge variant="secondary" className="text-[10px]">{entry.role}</Badge>
          <span className="text-xs text-muted-foreground">{entry.classification}</span>
        </div>

        {/* Large specimen */}
        <p className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4" style={{ fontFamily }}>
          Aa Bb Cc Dd Ee Ff Gg
        </p>
        <p className="text-2xl font-normal tracking-tight text-muted-foreground" style={{ fontFamily }}>
          The quick brown fox jumps over the lazy dog
        </p>

        {/* Weights */}
        <div className="flex flex-wrap gap-4 mt-6">
          {entry.weights.map((weight) => (
            <div key={weight} className="text-center">
              <span className="block text-xl" style={{ fontFamily, fontWeight: parseInt(weight) }}>Ag</span>
              <span className="text-[10px] text-muted-foreground mt-1 block">{weight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hierarchy examples */}
      <div className="p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Type Hierarchy</h3>
        {entry.hierarchyExamples.map((h) => (
          <div key={h.level} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pb-4 border-b border-border/60 last:border-0 last:pb-0">
            <div className="shrink-0 w-20">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{h.level}</span>
              <span className="block text-[10px] font-mono text-muted-foreground/60">{h.fontSize} / {h.fontWeight}</span>
            </div>
            <p style={{ fontFamily, fontSize: h.fontSize, fontWeight: parseInt(h.fontWeight), lineHeight: h.lineHeight }}>
              {h.sample}
            </p>
          </div>
        ))}
      </div>

      {/* Usage note + download */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mb-4">
          <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">{entry.usageDescription}</p>
        </div>
        <Button variant="secondary" size="sm" className="text-xs gap-1.5" data-testid={`download-font-${entry.id}`}>
          <Download className="w-3 h-3" />
          Download font files
        </Button>
      </div>
    </div>
  );
}
