import { apiClient } from "./api";

export async function getValidToken() {
  let token = localStorage.getItem("access_token"); // Fix token key
  const refreshToken = localStorage.getItem("refresh_token");

  if (!token || !refreshToken) {
    console.log("No token found, user needs to log in.");
    return null;
  }

  const res = await apiClient.post("/api/token/verify/", { // Add /api/ prefix for consistency
    body: JSON.stringify({ token }),
  });

  if (res.status !== 200) {
    console.log("Token expired! Trying to refresh...");

    const refreshRes = await apiClient.post("/api/token/refresh/", {
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("access_token", data.access); // Fix token key
      return data.access;
    } else {
      console.log("Refresh token invalid. User needs to log in.");
      return null;
    }
  }

  return token;
}
  

export async function logoutUser() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.log("No refresh token found, user already logged out.");
    return;
  }

  try {
    await apiClient.post("/api/auth/logout/", { // Match AuthProvider endpoint
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
  }

  localStorage.removeItem("access_token"); // Fix token key
  localStorage.removeItem("refresh_token");

  console.log("User logged out successfully.");
}

export function isAuthenticated() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("access_token"); // Fix token key
  }
  return false;
}