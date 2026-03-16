import { useState } from "react";
import { Search, Sparkles, ArrowRight, Loader2, Download, Palette, Type, BookOpen, Image, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { SearchResult } from "@shared/schema";

const suggestedQueries = [
  "What is our primary font?",
  "Show me the logo for dark backgrounds",
  "What are our brand colors?",
  "Download social media templates",
  "Show me our gradients",
  "What typography should I use for presentations?",
];

const categoryIcons: Record<string, React.ReactNode> = {
  logos: <Hexagon className="w-4 h-4" />,
  colors: <Palette className="w-4 h-4" />,
  gradients: <Palette className="w-4 h-4" />,
  typography: <Type className="w-4 h-4" />,
  images: <Image className="w-4 h-4" />,
  artwork: <Sparkles className="w-4 h-4" />,
  icons: <Sparkles className="w-4 h-4" />,
  guidelines: <BookOpen className="w-4 h-4" />,
};

interface AISearchProps {
  variant?: "hero" | "compact";
  slug: string;
}

export default function AISearch({ variant = "hero", slug }: AISearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setQuery(q);

    try {
      const res = await apiRequest("POST", `/api/public/${slug}/ai-search`, { query: q });
      const data = await res.json();
      setAnswer(data.answer || "");
      setResults(data.results || []);
    } catch {
      setAnswer("Something went wrong. Please try again.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const isHero = variant === "hero";

  return (
    <div className={isHero ? "w-full" : "w-full max-w-2xl"} data-testid="ai-search">
      {/* Search Input */}
      <div className={`relative group ${isHero ? "max-w-2xl mx-auto" : ""}`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <Sparkles className="w-5 h-5 group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ask anything about the brand..."
          className={`w-full rounded-xl border border-border bg-card pl-12 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all ${
            isHero ? "h-14 text-base shadow-lg" : "h-11"
          }`}
          data-testid="input-ai-search"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          data-testid="button-search-submit"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions */}
      {isHero && !hasSearched && (
        <div className="mt-4 flex flex-wrap justify-center gap-2" data-testid="search-suggestions">
          {suggestedQueries.map((sq) => (
            <button
              key={sq}
              onClick={() => handleSearch(sq)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              data-testid={`suggestion-${sq.slice(0, 20)}`}
            >
              {sq}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className={`mt-6 ${isHero ? "max-w-3xl mx-auto" : ""}`} data-testid="search-results">
          {/* AI Answer */}
          {answer && (
            <div className="mb-5 p-4 rounded-xl bg-card border border-border" data-testid="ai-answer">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">AI Brand Assistant</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{answer}</p>
            </div>
          )}

          {/* Result Cards */}
          {results.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.slice(0, 6).map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          )}

          {results.length === 0 && !isSearching && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No results found. Try a different query.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: SearchResult }) {
  return (
    <div
      className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
      data-testid={`result-card-${result.id}`}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
        {categoryIcons[result.category] || <Search className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{result.title}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0 capitalize">
            {result.category}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{result.description}</p>
        {result.downloadFiles && result.downloadFiles.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Download className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-primary font-medium">
              {result.downloadFiles.map((f) => f.format).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
