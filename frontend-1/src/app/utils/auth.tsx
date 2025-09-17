"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient, publicApiClient } from "./api";

// Define interfaces
interface User {
  email: string;
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, isGoogle?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create context with proper typing
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const initializeUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      try {
        const { data } = await apiClient.get("/auth/me/");
        setUser({ email: data.email, id: data.id, username: data.username });
      } catch (error: any) {
        console.error("Failed to initialize user:", error.response?.data || error.message);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    initializeUser();
  }, []);

  useEffect(() => {
    setLoading(true);
    initializeUser();
    // If you want to re-initialize on route change, you can use pathname or searchParams from useRouter (App Router)
    // Example:
    // setLoading(true);
    // initializeUser();
    // }, [router.pathname]);
  }, []);

  const login = async (token: string, isGoogle: boolean = false) => {
    try {
      const redirectUrl = searchParams.get("redirect") || "/";
      if (isGoogle) {
        const { data } = await publicApiClient.post("/auth/google/", { token });
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        setUser({ email: data.email, id: data.user_id, username: data.username });
      } else {
        localStorage.setItem("access_token", token);
        const { data } = await apiClient.get("/auth/me/");
        console.log(data);
        setUser({ email: data.email, id: data.id, username: data.username });
      }
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      if (accessToken && refreshToken) {
        await apiClient.post("/auth/logout/", { refresh: refreshToken });
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      router.push("/");
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data || error.message);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};