// utils/api.js
import axios from "axios";

const DEFAULT_API_URL = "http://localhost:8000/api";

export const getApiImgUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  const mediaUrl = `${baseUrl}`; // Add /media/ prefix
  return mediaUrl;
};

export const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  return url;
};

export const buildApiUrl = ({endpoint}:{endpoint: string}) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${getApiUrl()}${cleanEndpoint}`;
  return fullUrl;
};

export const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicApiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// New FormData-specific client
export const formApiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Accept": "application/json",
    // Content-Type set dynamically in interceptor
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

formApiClient.interceptors.request.use((config) => {
  // Ensure Content-Type is multipart/form-data for FormData
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  // Add Authorization header if token exists
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  console.log('formApiClient Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data instanceof FormData ? 'FormData' : config.data,
  });

  return config;
});