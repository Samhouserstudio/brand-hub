import { Link } from "wouter";
import { Hexagon, Palette, Search, Share2, Layers, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const features = [
  {
    icon: Palette,
    title: "Brand Assets",
    description: "Organize logos, colors, typography, and guidelines in one central hub.",
  },
  {
    icon: Search,
    title: "AI Search",
    description: "Find any asset instantly with intelligent, context-aware search.",
  },
  {
    icon: Share2,
    title: "Share with Clients",
    description: "Publish a branded portal your clients and partners can access.",
  },
  {
    icon: Layers,
    title: "Multi-Brand Support",
    description: "Manage multiple brand identities from a single dashboard.",
  },
];

const steps = [
  { number: "1", title: "Create", description: "Set up your brand hub in seconds with a name, slug, and colors." },
  { number: "2", title: "Customize", description: "Add logos, colors, fonts, guidelines, and any other brand assets." },
  { number: "3", title: "Share", description: "Publish your hub and share the link with anyone who needs your brand assets." },
];

export default function LandingPage() {
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
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3 h-3" />
            AI-powered brand management
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
          >
            Your brand, organized{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              and shareable
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Create beautiful brand hubs for your logos, colors, typography, and guidelines.
            Share a single link with clients and collaborators.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
          >
            Everything your brand needs
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2
            className="text-2xl font-bold text-center mb-10"
            style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
          >
            Three steps to your brand hub
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.number} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {s.number}
                </div>
                <h3 className="text-sm font-semibold mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <h2
            className="text-xl font-bold mb-3"
            style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
          >
            Ready to organize your brand?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first brand hub in under a minute. No credit card required.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <PerplexityAttribution />
    </div>
  );
}
