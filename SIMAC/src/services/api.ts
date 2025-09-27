import axios, { AxiosInstance } from "axios";

const defaultBase: string =
  typeof window !== "undefined" && (window as any).appConfig?.apiBaseUrl
    ? (window as any).appConfig.apiBaseUrl
    : import.meta.env.VITE_API_URL || "http://localhost:3002";

const api: AxiosInstance = axios.create({
  baseURL: defaultBase,
});

export default api;