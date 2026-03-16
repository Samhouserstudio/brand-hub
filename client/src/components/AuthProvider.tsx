import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiRequest, setAuthTokenGetter, queryClient } from "@/lib/queryClient";

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register the token getter so apiRequest/getQueryFn can use it
  useEffect(() => {
    setAuthTokenGetter(() => token);
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    queryClient.clear();
  }, []);

  const signup = useCallback(async (email: string, name: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/signup", { email, name, password });
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    queryClient.clear();
  }, []);

  const logout = useCallback(() => {
    if (token) {
      // Fire and forget
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
