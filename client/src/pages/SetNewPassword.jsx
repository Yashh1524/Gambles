import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";

const SetNewPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");

    // Handle password mismatch on confirm password change
    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);

        // Check if passwords match
        if (confirmPasswordValue !== newPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setPasswordError(""); // Clear any error before submitting

        try {
            const res = await api.post(
                `${import.meta.env.VITE_API_URL}/api/user/set-new-password`,
                { email, newPassword }
            );
            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to set new password");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-center">Set New Password</h2>
                
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full border px-4 py-2 rounded-md"
                />
                
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange} // Handle confirm password change
                    required
                    className={`w-full px-4 py-2 rounded-md border ${
                        passwordError ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                )}

                <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                    Set Password
                </button>
            </form>
        </div>
    );
};

export default SetNewPassword;
