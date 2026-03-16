import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

export default function SignupPage() {
  const { signup } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, name, password);
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Hexagon className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
              Brand Hub
            </span>
          </Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Cabinet Grotesk', var(--font-sans)" }}>
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Start managing your brand assets</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</div>
          )}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
      <PerplexityAttribution />
    </div>
  );
}
