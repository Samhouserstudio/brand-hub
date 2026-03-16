import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Hexagon, Plus, Globe, Lock, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { BrandHub } from "@shared/schema";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: hubs, isLoading } = useQuery<BrandHub[]>({
    queryKey: ["/api/hubs"],
  });

  // Redirect if not logged in
  if (!user) {
    setLocation("/login");
    return null;
  }

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
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}
            >
              Your Brand Hubs
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage your brand asset portals.
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" /> New Hub
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border animate-pulse">
                <CardContent className="p-5 h-36" />
              </Card>
            ))}
          </div>
        ) : hubs && hubs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hubs.map((hub) => (
              <Card
                key={hub.id}
                className="border-border hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: hub.primaryColor }}
                    >
                      {hub.name.charAt(0).toUpperCase()}
                    </div>
                    <Badge variant={hub.published ? "default" : "secondary"} className="text-[10px]">
                      {hub.published ? (
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Published</span>
                      ) : (
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Draft</span>
                      )}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{hub.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {hub.description || "No description"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => { e.stopPropagation(); setLocation(`/hub/${hub.slug}/admin`); }}
                    >
                      Manage
                    </Button>
                    {hub.published && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 gap-1"
                        onClick={(e) => { e.stopPropagation(); setLocation(`/hub/${hub.slug}`); }}
                      >
                        <ExternalLink className="w-3 h-3" /> View
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add new hub card */}
            <Link href="/dashboard/new">
              <Card className="border-border border-dashed hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[160px] text-muted-foreground">
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Create New Hub</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <Hexagon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No brand hubs yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first brand hub to start organizing your assets.
            </p>
            <Link href="/dashboard/new">
              <Button className="gap-1.5">
                <Plus className="w-4 h-4" /> Create Your First Hub
              </Button>
            </Link>
          </div>
        )}
      </div>

      <PerplexityAttribution />
    </div>
  );
}
