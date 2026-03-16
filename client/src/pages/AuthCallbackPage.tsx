import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import { Hexagon, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { handleGoogleCallback } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Parse the query params from the hash URL
    // Hash URL looks like: /#/auth/callback?token=...&name=...&email=...&id=...
    const hash = window.location.hash;
    const queryIndex = hash.indexOf("?");
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      handleGoogleCallback(params);
      setLocation("/dashboard");
    } else {
      setLocation("/login");
    }
  }, [handleGoogleCallback, setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Hexagon className="w-8 h-8 text-primary mb-4" />
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground mt-3">Signing you in...</p>
    </div>
  );
}
