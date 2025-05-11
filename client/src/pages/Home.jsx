import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LogoutButton from '../components/LogoutButton';

const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await api.get("/api/user/my-details", {withCredentials: true});
                setUser(res.data.data);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="p-4 min-h-screen">
            <h1 className="text-xl font-semibold mb-4">Home</h1>
            {loading ? (
                <p>Loading user details...</p>
            ) : user ? (
                <div className="space-y-2">
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <LogoutButton onLogout={() => setUser(null)} />
                </div>
            ) : (
                <div className="space-x-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
