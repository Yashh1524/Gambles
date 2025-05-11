// utils/api.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Match your backend's actual error message for expired token
        const isAccessTokenExpired =
            error.response?.status === 401 &&
            error.response?.data?.message === "Access token expired";

        if (isAccessTokenExpired && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post("/api/user/refresh-token");
                return api(originalRequest); // Retry original request
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
