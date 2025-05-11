import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/api/user/my-details", { withCredentials: true });
                setUser(res.data.data);
            } catch (err) {
                console.error("Failed to fetch user:", err);

                // If token expired, try refreshing it and retry user fetch
                if (
                    err.response?.status === 401 &&
                    err.response.data?.message === "Access token expired"
                ) {
                    try {
                        await api.post("/api/user/refresh-token", null, {
                            withCredentials: true,
                        });

                        // Retry the original user fetch after token refresh
                        const res = await api.get("/api/user/my-details", { withCredentials: true });
                        setUser(res.data.data);
                    } catch (refreshErr) {
                        console.error("Token refresh failed in UserProvider:", refreshErr);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {!loading ? children : <div className="p-4 text-white">Loading...</div>}
        </UserContext.Provider>
    );
};
