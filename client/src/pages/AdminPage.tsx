import { useQuery } from "@tanstack/react-query";
import { Settings, Upload, Palette, Type, Image, Hexagon, BookOpen, Sparkles, Shapes, BarChart3, Users, Shield, FolderOpen, TrendingUp, Download, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BrandAsset, BrandColor, TypographyEntry, GuidelineModule } from "@shared/schema";

const stats = [
  { label: "Total Assets", value: "14", icon: FolderOpen, change: "+3 this month" },
  { label: "Downloads", value: "2,847", icon: Download, change: "+12% vs last month" },
  { label: "Searches", value: "1,203", icon: Search, change: "Most searched: logo" },
  { label: "Active Users", value: "89", icon: Users, change: "23 external guests" },
];

const quickActions = [
  { label: "Upload Asset", icon: Upload, description: "Add new files to the brand hub" },
  { label: "Edit Colors", icon: Palette, description: "Manage color palette and gradients" },
  { label: "Edit Typography", icon: Type, description: "Update font families and hierarchy" },
  { label: "Edit Guidelines", icon: BookOpen, description: "Modify brand usage rules" },
  { label: "Manage Users", icon: Shield, description: "Invite users and set permissions" },
  { label: "View Analytics", icon: BarChart3, description: "Asset usage and search analytics" },
];

export default function AdminPage() {
  const { data: assets } = useQuery<BrandAsset[]>({ queryKey: ["/api/assets"] });
  const { data: colors } = useQuery<BrandColor[]>({ queryKey: ["/api/colors"] });
  const { data: typography } = useQuery<TypographyEntry[]>({ queryKey: ["/api/typography"] });
  const { data: guidelines } = useQuery<GuidelineModule[]>({ queryKey: ["/api/guidelines"] });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10" data-testid="page-admin">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Admin Dashboard
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your brand hub assets, settings, and users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              </div>
              <p className="text-xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-base font-bold mb-4" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card text-left hover:border-primary/30 hover:shadow-sm transition-all"
              data-testid={`action-${action.label.toLowerCase().replace(" ", "-")}`}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <action.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{action.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Asset Inventory */}
      <div className="mb-10">
        <h2 className="text-base font-bold mb-4" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
          Asset Inventory
        </h2>
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="asset-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Asset</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Category</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Tags</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Visibility</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {assets?.slice(0, 8).map((asset) => (
                    <tr key={asset.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {asset.featured && <Sparkles className="w-3 h-3 text-amber-500" />}
                          <span className="text-sm font-medium">{asset.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{asset.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {asset.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px] capitalize">{asset.visibility}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{asset.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color & Typography Summary */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold mb-3" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Color Palette ({colors?.length || 0} colors)
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors?.map((c) => (
              <div key={c.id} className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-card" data-testid={`admin-color-${c.id}`}>
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: c.hex }} />
                <span className="text-xs">{c.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{c.hex}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-3" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Typography ({typography?.length || 0} families)
          </h3>
          <div className="space-y-2">
            {typography?.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-card" data-testid={`admin-type-${t.id}`}>
                <span className="text-base font-bold" style={{ fontFamily: `'${t.familyName}', sans-serif` }}>Aa</span>
                <div>
                  <span className="text-sm font-medium">{t.familyName}</span>
                  <span className="text-xs text-muted-foreground ml-2">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
