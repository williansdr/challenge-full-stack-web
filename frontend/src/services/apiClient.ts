import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    const token = authStore.token.value;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      (response.data.currentPage !== undefined ||
        response.data.totalCount !== undefined)
    ) {
      return response;
    }

    if (response.data && response.data.data !== undefined) {
      return { ...response, data: response.data.data };
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = "/signin";
    }

    const message =
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      error.message ||
      "An error occurred";

    return Promise.reject(
      new Error(Array.isArray(message) ? message.join(", ") : message)
    );
  }
);

export default apiClient;
