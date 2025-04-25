import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";

const VerifyResetPasswordOTP = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                `${import.meta.env.VITE_API_URL}/api/user/verify-reset-password-otp`,
                { email, otp }
            );
            toast.success(res.data.message);
            navigate(`/set-new-password?email=${email}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <form
                onSubmit={handleVerify}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-center">Verify OTP</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full border px-4 py-2 rounded-md"
                />
                <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                    Verify
                </button>
            </form>
        </div>
    );
};

export default VerifyResetPasswordOTP;
