import { get } from "http";
import { apiClient, publicApiClient } from "./api";
import { jwtDecode } from "jwt-decode";

// Interface for apiClient
interface ApiClient {
  post: (url: string, options: { body: string }) => Promise<{ data: any }>;
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

export async function login(token: string, isGoogle: boolean = false): Promise<void> {
  if (typeof window !== "undefined") {
    if (isGoogle) {
      // Send Google credential to backend
      console.log("Sending Google token to backend:", token);
      const response = await publicApiClient.post("/auth/google/", {
        body: JSON.stringify({ token }),
      });
      console.log("Google login response:", response.data);
      const { access, refresh } = response.data;
      saveToken(access);
      // localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      document.cookie = `access_token=${access}; path=/;`;
      window.location.reload();
      // Redirect to /account on successful Google login
      // if (router && response.data) {
      //   router.push('/account');
      // }
    } else {
      // Standard login: store access token directly
      localStorage.setItem("access_token", token);
      document.cookie = `access_token=${token}; path=/;`;
    }
  }
}

// export async function getValidToken(): Promise<string | null> {
//   let token = localStorage.getItem("access_token");
//   const refreshToken = localStorage.getItem("refresh_token");

//   if (!token || !refreshToken) {
//     console.log("No token found, user needs to log in.");
//     return null;
//   }

//   const res: Response = await apiClient.post("/api/token/verify/", {
//     body: JSON.stringify({ token }),
//   });

//   if (res.status !== 200) {
//     console.log("Token expired! Trying to refresh...");

//     const refreshRes: Response = await apiClient.post("/api/token/refresh/", {
//       body: JSON.stringify({ refresh: refreshToken }),
//     });

//     if (refreshRes.ok) {
//       const data: TokenRefreshResponse = await refreshRes.json();
//       localStorage.setItem("access_token", data.access);
//       // Update cookie
//       if (typeof window !== "undefined") {
//         document.cookie = `access_token=${data.access}; path=/;`;
//       }
//       return data.access;
//     } else {
//       console.log("Refresh token invalid. User needs to log in.");
//       return null;
//     }
//   }

//   return token;
// }

export async function logoutUser(): Promise<void> {
  const refreshToken = localStorage.getItem("access_token");

  if (!refreshToken) {
    console.log("No refresh token found, user already logged out.");
    return;
  }

  // try {
  //   await apiClient.post("/api/auth/logout/", {
  //     body: JSON.stringify({ refresh: refreshToken }),
  //   });
  // } catch (error: any) {
  //   console.error("Logout failed:", error.response?.data || error.message);
  // }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // Clear cookie on logout
  if (typeof window !== "undefined") {
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  console.log("User logged out successfully.");
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true; // invalid token = treat as expired
  }
}

function getValidToken(): string | null {
  const token = localStorage.getItem("access_token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    console.log('removed token')
    return null;
  }
  return token;
}

function saveToken(token: string) {
  localStorage.setItem("access_token", token);

  // 1 minute = 60,000 ms
  setTimeout(() => {
    localStorage.removeItem("access_token");
  }, 1_800_000);
}



export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === "undefined" || !window.localStorage) {
    console.log("Not in a browser environment");
    return false;
  }

  const token = getValidToken();
  console.log("Token found in localStorage:", token);

  if (!token) {
    return false;
  }

  try {
    // Check token expiration client-side
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log("Access token expired");
      const refreshed = await refreshToken();
      if (!refreshed) {
        // Clear tokens if refresh fails
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return false;
      }
      // Token was refreshed, re-validate
      return true;
    }

    // Token is not expired, verify with server
    const response = await apiClient.get("auth/me/", {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });

    if (response.status === 200) {
      return true;
    } else {
      console.log("Token is invalid");
      // Attempt to refresh the token
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
    // Clear tokens on error
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return false;
  }
}

async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.log("No refresh token available");
    return false;
  }

  try {
    // Check refresh token expiration
    const decoded = jwtDecode<JWTPayload>(refreshToken);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log("Refresh token expired");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return false;
    }

    // Attempt to refresh the access token
    const response = await apiClient.post("token/refresh/", {
      refresh: refreshToken,
    });

    if (response.status === 200) {
      localStorage.setItem("access_token", response.data.access);
      console.log("Token refreshed successfully");
      return true;
    } else {
      console.log("Failed to refresh token");
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