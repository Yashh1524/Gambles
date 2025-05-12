// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/user/my-details", { withCredentials: true });
            setUser(res.data.data);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails(); // fetch on mount
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, fetchUserDetails, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
