import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { GuidelineModule } from "@shared/schema";
import { useState } from "react";

export default function GuidelinesPage() {
  const { data: guidelines, isLoading } = useQuery<GuidelineModule[]>({ queryKey: ["/api/guidelines"] });
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const activeModule = activeSlug
    ? guidelines?.find((g) => g.slug === activeSlug)
    : guidelines?.[0];

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-guidelines">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Brand Guidelines
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Live brand standards and usage rules. The definitive reference for how to use the Meridian brand.
        </p>
      </div>

      {isLoading ? (
        <div className="flex gap-6">
          <Skeleton className="w-56 h-96 rounded-xl shrink-0 hidden sm:block" />
          <Skeleton className="flex-1 h-96 rounded-xl" />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Side nav */}
          <nav className="sm:w-56 shrink-0" data-testid="guidelines-nav">
            <div className="sticky top-20 space-y-0.5">
              {guidelines?.map((g) => (
                <button
                  key={g.slug}
                  onClick={() => setActiveSlug(g.slug)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-left transition-colors ${
                    (activeSlug || guidelines[0]?.slug) === g.slug
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-testid={`guideline-nav-${g.slug}`}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{g.title}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeModule && (
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8" data-testid={`guideline-content-${activeModule.slug}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
                      {activeModule.title}
                    </h2>
                    <span className="text-xs text-muted-foreground capitalize">{activeModule.type.replace("-", " & ")}</span>
                  </div>
                </div>

                <GuidelineContent content={activeModule.content} type={activeModule.type} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GuidelineContent({ content, type }: { content: string; type: string }) {
  // Parse the content into sections
  const lines = content.split("\n").filter(Boolean);

  return (
    <div className="prose-sm max-w-none space-y-3" data-testid="guideline-body">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Bold headers
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <h3 key={i} className="text-sm font-bold mt-5 first:mt-0 text-foreground">
              {trimmed.replace(/\*\*/g, "")}
            </h3>
          );
        }

        // Bold-prefixed lines
        if (trimmed.startsWith("**")) {
          const match = trimmed.match(/^\*\*(.+?)\*\*\s*(.*)/);
          if (match) {
            return (
              <p key={i} className="text-sm text-foreground leading-relaxed">
                <span className="font-semibold">{match[1]}</span> {match[2]}
              </p>
            );
          }
        }

        // Bullet points with bold
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const text = trimmed.replace(/^[•\-]\s*/, "");
          const hasBold = text.includes("**");

          // Check/cross bullets
          if (trimmed.startsWith("✓") || trimmed.startsWith("✗")) {
            const isGood = trimmed.startsWith("✓");
            return (
              <div key={i} className="flex items-start gap-2 pl-1">
                {isGood ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <span className="text-sm text-foreground">{trimmed.slice(2).trim()}</span>
              </div>
            );
          }

          if (hasBold) {
            const parsed = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            return (
              <div key={i} className="flex items-start gap-2 pl-1">
                <span className="text-primary mt-1.5 text-xs">&#9679;</span>
                <span className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />
              </div>
            );
          }

          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="text-primary mt-1.5 text-xs">&#9679;</span>
              <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
            </div>
          );
        }

        // Check/X lines
        if (trimmed.startsWith("✓") || trimmed.startsWith("✗")) {
          const isGood = trimmed.startsWith("✓");
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              {isGood ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <span className="text-sm text-foreground">{trimmed.slice(2).trim()}</span>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
