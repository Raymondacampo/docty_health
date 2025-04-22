  // context/auth.js
  "use client";
  import { createContext, useContext, useState } from "react";
  import { useRouter } from "next/router";
  import { apiClient, publicApiClient } from "@/utils/api";
  import { useEffect } from "react";
  const AuthContext = createContext(null);

  export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const initializeUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token && !user) {
        try {
          const { data } = await apiClient.get("/auth/me/");
          setUser({ email: data.email, id: data.id, username: data.username });
        } catch (error) {
          console.error("Failed to initialize user:", error.response?.data || error.message);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
        }
      }
    };
  
    useEffect(() => {
      initializeUser(); // Run on mount
    }, []);

    useEffect(() => {
      const handleRouteChange = () => {
        initializeUser(); // Run on route change
      };
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }, [router.events]);

    const login = async (token, isGoogle = false) => {
      try {
        if (isGoogle) {
          const { data } = await publicApiClient.post("/auth/google/", { token });
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          setUser({ email: data.email, id: data.user_id, username: data.username });
        } else {
          localStorage.setItem("access_token", token);
          const { data } = await apiClient.get("/auth/me/");
          console.log(data)
          setUser({ email: data.email, id: data.id, username: data.username });
        }
        router.push("/account");
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
      }
    };

    const logout = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        if (accessToken && refreshToken) {
          await apiClient.post("/auth/logout/", { refresh: refreshToken }); // Use apiClient
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        router.push("/login");
      }
    };

    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
  };