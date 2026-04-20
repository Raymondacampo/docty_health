// utils/api.tsx
import axios from "axios";
import Cookies from "js-cookie"; // Asegúrate de instalarlo: npm install js-cookie @types/js-cookie

const DEFAULT_API_URL = "http://localhost:8000/api";

export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
};

export const getApiImgUrl = () => {
  const baseUrl = getApiUrl().replace('/api', '') || 'http://localhost:8000';
  return baseUrl;
};

// --- INSTANCIA BASE ---
const createAxiosInstance = (isFormData = false) => {
  const instance = axios.create({
    baseURL: getApiUrl(),
    headers: {
      "Accept": "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });

  // INTERCEPTOR DE PETICIÓN: Añadir el token desde Cookies
  instance.interceptors.request.use((config) => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    if (isFormData && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  });

  // INTERCEPTOR DE RESPUESTA: El "Silent Refresh"
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Si Django devuelve 401 y no hemos reintentado ya esta petición
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = Cookies.get("refresh_token");

        if (refreshToken) {
          try {
            // Intentamos obtener un nuevo access_token
            const refreshRes = await axios.post(`${getApiUrl()}/token/refresh/`, {
              refresh: refreshToken,
            });

            const newAccessToken = refreshRes.data.access;

            // Actualizamos la cookie
            Cookies.set("access_token", newAccessToken, { 
              secure: process.env.NODE_ENV === "production",
              sameSite: 'lax',
              path: '/' 
            });

            // Reintentamos la petición original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Si el refresh también falla (ej. expiró el de 7 días), al login
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Clientes exportados
export const apiClient = createAxiosInstance();
export const formApiClient = createAxiosInstance(true);
export const publicApiClient = axios.create({ baseURL: getApiUrl() });