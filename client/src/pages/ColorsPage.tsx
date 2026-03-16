import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { BrandColor, BrandGradient } from "@shared/schema";

export default function ColorsPage() {
  const { data: colors, isLoading: loadingColors } = useQuery<BrandColor[]>({ queryKey: ["/api/colors"] });
  const { data: gradients, isLoading: loadingGradients } = useQuery<BrandGradient[]>({ queryKey: ["/api/gradients"] });

  const groups = colors
    ? Array.from(new Set(colors.map((c) => c.group)))
    : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-colors">
      <div className="mb-8">
        <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Colors
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          The complete brand color system. Click any value to copy to clipboard.
        </p>
      </div>

      {/* Color Groups */}
      {loadingColors ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : (
        groups.map((group) => (
          <div key={group} className="mb-10">
            <h2 className="text-base font-bold mb-4" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              {group}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {colors
                ?.filter((c) => c.group === group)
                .map((color) => <ColorCard key={color.id} color={color} />)}
            </div>
          </div>
        ))
      )}

      {/* Gradients */}
      <div className="mt-16">
        <h2 className="text-lg font-bold tracking-tight mb-2" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Gradients
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Approved gradient combinations with copy-ready CSS.
        </p>

        {loadingGradients ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradients?.map((gradient) => <GradientCard key={gradient.id} gradient={gradient} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ColorCard({ color }: { color: BrandColor }) {
  const { toast } = useToast();
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyValue = (label: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedValue(label);
    toast({ title: "Copied", description: `${label}: ${value}` });
    setTimeout(() => setCopiedValue(null), 1500);
  };

  const values = [
    { label: "HEX", value: color.hex },
    { label: "RGB", value: color.rgb },
    { label: "CMYK", value: color.cmyk },
    ...(color.pantone ? [{ label: "Pantone", value: color.pantone }] : []),
  ];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" data-testid={`color-card-${color.id}`}>
      {/* Swatch */}
      <div className="h-24 relative" style={{ backgroundColor: color.hex }}>
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-white backdrop-blur-sm">
            {color.hex}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-sm font-semibold mb-0.5">{color.name}</h3>
        <span className="text-[10px] text-muted-foreground capitalize">{color.role}</span>

        {/* Values */}
        <div className="mt-2.5 space-y-1">
          {values.map((v) => (
            <button
              key={v.label}
              onClick={() => copyValue(v.label, v.value)}
              className="flex items-center justify-between w-full px-2 py-1 rounded text-[11px] hover:bg-muted/50 transition-colors group"
              data-testid={`copy-${color.id}-${v.label.toLowerCase()}`}
            >
              <span className="text-muted-foreground">{v.label}</span>
              <span className="flex items-center gap-1 font-mono text-foreground">
                {v.value}
                {copiedValue === v.label ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GradientCard({ gradient }: { gradient: BrandGradient }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyCSS = () => {
    navigator.clipboard.writeText(gradient.css).catch(() => {});
    setCopied(true);
    toast({ title: "Copied", description: "CSS gradient code copied" });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" data-testid={`gradient-card-${gradient.id}`}>
      {/* Preview */}
      <div className="h-32 relative" style={{ background: gradient.css }}>
        <div className="absolute bottom-2 right-2 flex gap-1">
          {gradient.colors.map((c) => (
            <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-white backdrop-blur-sm">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold mb-0.5">{gradient.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{gradient.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {gradient.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
          ))}
        </div>

        {/* Copy CSS */}
        <button
          onClick={copyCSS}
          className="flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-md text-[11px] font-mono bg-muted/50 hover:bg-muted transition-colors text-muted-foreground truncate"
          data-testid={`copy-gradient-${gradient.id}`}
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <Copy className="w-3 h-3 shrink-0" />}
          <span className="truncate">{gradient.css}</span>
        </button>
      </div>
    </div>
  );
}
