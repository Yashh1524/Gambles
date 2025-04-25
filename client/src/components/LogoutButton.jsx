// components/LogoutButton.jsx
import React from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogoutButton = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await api.post("/api/user/logout");

            if (response?.data?.success) {
                toast.success("Logged out successfully");
                onLogout(); // Trigger parent state update
                // navigate("/login"); // Optional redirect
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
