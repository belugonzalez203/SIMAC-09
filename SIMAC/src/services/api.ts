// src/services/api.ts
import axios, { AxiosInstance } from "axios";

declare global {
  interface Window {
    appConfig?: {
      apiBaseUrl?: string;
    };
  }
}

const baseFromWindow = typeof window !== "undefined" ? window.appConfig?.apiBaseUrl : undefined;
const defaultBase = baseFromWindow ?? (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3002";

const api: AxiosInstance = axios.create({
  baseURL: defaultBase,
  timeout: 10000, // 10s, opcional
});

// Ejemplo sencillo de interceptor de errores (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes normalizar errores, mostrar toast, log, etc.
    return Promise.reject(error);
  }
);

export default api;
