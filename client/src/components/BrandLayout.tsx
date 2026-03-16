import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { PerplexityAttribution } from "./PerplexityAttribution";
import {
  Sun,
  Moon,
  Hexagon,
  Menu,
  X,
  Home,
  Image,
  Palette,
  Type,
  BookOpen,
  Sparkles,
  Layers,
  Shapes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BrandLayoutProps {
  children: React.ReactNode;
  hubName?: string;
  hubSlug?: string;
}

export default function BrandLayout({ children, hubName, hubSlug }: BrandLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const base = hubSlug ? `/hub/${hubSlug}` : "";

  const navItems = [
    { label: "Home", href: `${base}` || "/", icon: Home },
    { label: "Logos", href: `${base}/logos`, icon: Hexagon },
    { label: "Colors", href: `${base}/colors`, icon: Palette },
    { label: "Typography", href: `${base}/typography`, icon: Type },
    { label: "Images", href: `${base}/images`, icon: Image },
    { label: "Artwork", href: `${base}/artwork`, icon: Sparkles },
    { label: "Icons", href: `${base}/icons`, icon: Shapes },
    { label: "Guidelines", href: `${base}/guidelines`, icon: BookOpen },
  ];

  const displayName = hubName || "Brand Hub";

  return (
    <div className="min-h-screen flex flex-col bg-background" data-testid="brand-layout">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4 px-4 sm:px-6 h-14">
          {/* Logo */}
          <Link href={navItems[0].href} className="flex items-center gap-2.5 shrink-0" data-testid="link-home">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="Brand Hub logo">
                <path d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM14 14h7v7h-7v-7z" fill="white" opacity="0.9"/>
                <path d="M6.5 6.5h0M17.5 6.5h0M6.5 17.5h0M17.5 17.5h0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight hidden sm:inline">{displayName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== navItems[0].href && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-border/60 bg-background p-3 space-y-1" data-testid="nav-mobile">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 px-4 sm:px-6">
        <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{displayName}</span>
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
