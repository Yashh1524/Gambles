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
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {!loading ? children : <div className="p-4">Loading...</div>}
        </UserContext.Provider>
    );
};
