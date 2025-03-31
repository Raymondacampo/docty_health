// utils/api.js

// Default base URL (fallback for development)
const DEFAULT_API_URL = "http://localhostd:8000/api";

// Function to get the base API URL
export const getApiUrl = () => {
  // Use environment variable if available, otherwise fallback to default
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
};

// Helper to construct full endpoint URLs
export const buildApiUrl = (endpoint) => {
  // Ensure endpoint starts with a slash and remove any duplicate slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${getApiUrl()}${cleanEndpoint}`;
};

// Optional: Pre-configured axios instance with the base URL
import axios from "axios";

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Authorization header dynamically
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});