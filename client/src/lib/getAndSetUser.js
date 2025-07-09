import api from "./api";
import { useUser } from "../contexts/UserContext";

export const useUserFetcher = () => {
    const { setUser } = useUser();

    const getAndSetUser = async () => {
        try {
            const res = await api.get("/api/user/my-details", {
                withCredentials: true,
            });
            setUser(res.data.data);
            return res.data.data;
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setUser(null);
        }
    };

    return { getAndSetUser };
};
