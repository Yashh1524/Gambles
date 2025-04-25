// pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(
                `${import.meta.env.VITE_API_URL}/api/user/reset-password`,
                { email },
                { withCredentials: true }
            )

            // console.log("response:", response)
            if(response?.data?.success) {
                toast.success("OTP is sent to your email")
                // navigate("/verify-forgot-password-otp", { state: { email }})
                navigate(`/verify-forgot-password-otp?email=${email}`);
            } else {
                toast.error(response?.data?.message)
            }
        } catch (error) {
            // console.error("Login failed:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold text-center">Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border px-4 py-2 rounded-md"
                />
                <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                    Send OTP
                </button>
                <p className="text-sm text-center">
                    Back to{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
