import { apiClient, publicApiClient } from "./api";
import { jwtDecode } from "jwt-decode";

// Interface for apiClient
interface ApiClient {
  post: (url: string, data: any) => Promise<{ data: any }>;
}

// Interface for token verification response
interface TokenVerifyResponse {
  status: number;
}

// Interface for token refresh response
interface TokenRefreshResponse {
  access: string;
}

interface JWTPayload {
  exp: number;
  [key: string]: any;
}

export async function login(token: string, isGoogle: boolean = false, isGoogleCallback: boolean = false, redirectUri?: string | null): Promise<void> {
  if (typeof window !== "undefined") {
    if (isGoogle) {
      if (isGoogleCallback) {
        // Handle Google redirect callback: exchange authorization code for tokens
        const response = await publicApiClient.post("/auth/google/callback/", { code: token });
        const { access, refresh } = response.data;
        saveToken(access);
        localStorage.setItem("refresh_token", refresh);
        document.cookie = `access_token=${access}; path=/;`;
        window.location.href = redirectUri || '/account';      
      } else {
        // Send Google ID token to backend (for popup flow, kept for compatibility)
        const response = await publicApiClient.post("/auth/google/", {
          token
        });
        const { access, refresh } = response.data;
        saveToken(access);
        localStorage.setItem("refresh_token", refresh);
        document.cookie = `access_token=${access}; path=/;`;
        window.location.href = redirectUri || '/account';
      }
    } else {
      // Standard login: store access token directly
      saveToken(token);
      document.cookie = `access_token=${token}; path=/;`;
    }
  }
}

export async function logoutUser(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    return;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  if (typeof window !== "undefined") {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
}

function saveToken(token: string) {
  localStorage.setItem("access_token", token);
  setTimeout(() => {
    localStorage.removeItem("access_token");
  }, 1_800_000);
}

export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  const token = getValidToken();

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return false;
      }
      return true;
    }

    const response = await apiClient.get("auth/me/");
    if (response.status === 200) {
      return true;
    } else {
      const refreshed = await refreshToken();
      if (!refreshed) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return false;
  }
}

async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    return false;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(refreshToken);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return false;
    }

    const response = await apiClient.post("token/refresh/", {
      refresh: refreshToken,
    });

    if (response.status === 200) {
      localStorage.setItem("access_token", response.data.access);
      return true;
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return false;
  }
}

function getValidToken(): string | null {
  const token = localStorage.getItem("access_token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return null;
  }
  return token;
}