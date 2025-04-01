// hooks/useUser.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { apiClient } from "@/utils/api";
import api from "@/utils/axios";
import { buildApiUrl } from "@/utils/api";
// Helper function to check if a JWT token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() > expirationTime;
  } catch (error) {
    console.error("Invalid token format:", error);
    return true;
  }
};

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0); // For triggering reloads
  const router = useRouter();

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken || isTokenExpired(accessToken)) {
          console.log("Token missing or expired. Redirecting to login...");
          router.push("/login");
          return;
        }
        const { data } = await apiClient.get("auth/me/",  {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(data)
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (error.response?.status === 401) {
          console.log("Invalid token. Redirecting to login...");
          localStorage.removeItem("access_token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, reloadCount]); // Reload when router or reloadCount changes

  const reload = () => setReloadCount((prev) => prev + 1); // Trigger a reload

  return { user, loading, reload };
};