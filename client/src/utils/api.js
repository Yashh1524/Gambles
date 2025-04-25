import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If token expired and hasn't already tried to refresh
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            error.response.message === "Access token expired"
        ) {
            originalRequest._retry = true;

            try {
                await api.post("/api/user/refresh-token");
                return api(originalRequest); // Retry the original request
            } catch (err) {
                // Optional: redirect to login if refresh fails
                console.error("Token refresh failed:", err);
            }
        }

        return Promise.reject(error);
    }
);

export default api 