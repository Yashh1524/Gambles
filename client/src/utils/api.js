import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Retry once on 401 Unauthorized
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                await api.post("/api/user/refresh-token");
                return api(originalRequest); // Retry original request
            } catch (err) {
                console.error("Token refresh failed:", err);
                // Optional: redirect to login
            }
        }

        return Promise.reject(error);
    }
);

export default api;
