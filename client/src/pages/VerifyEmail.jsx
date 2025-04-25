import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); // "loading", "success", "error"
    const [email, setEmail] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const [resendError, setResendError] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");

        const verifyEmail = async () => {
            if (!token) {
                setStatus("error");
                toast.error("No token found in URL.");
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/user/verify-user/${token}`,
                    { withCredentials: true }
                );

                if (response?.data?.success) {
                    setStatus("success");

                    // Use toast.promise to handle success
                    toast.promise(
                        new Promise((resolve) => resolve("Email verified successfully!")),
                        {
                            loading: "Verifying...",
                            success: "Email verified successfully!",
                            error: "Verification failed."
                        }
                    );

                    // Add a slight delay for the toast to be visible before navigation
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                } else {
                    setStatus("error");
                    toast.error(response?.data?.message || "Verification failed.");
                }
            } catch (error) {
                setStatus("error");
                toast.error(error.response?.data?.message || "Verification failed.");
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    const handleResend = async () => {
        if (!email) {
            setResendError(true);
            setResendMessage("Please enter a valid email.");
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/resend-verification`,
                { email }
            );
            setResendError(false);
            setResendMessage(res.data.message || "Verification email sent.");
            toast.success(res.data.message || "Verification email sent.");
        } catch (error) {
            setResendError(true);
            setResendMessage(
                error.response?.data?.message || "Failed to resend verification email."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h1>

                {status === "loading" && (
                    <p className="text-gray-600">Verifying your token...</p>
                )}

                {status === "success" && (
                    <p className="text-green-600 font-medium">Redirecting to home...</p>
                )}

                {status === "error" && (
                    <div className="mt-4 text-left">
                        <p className="text-red-600 mb-4">
                            Something went wrong with verification.
                        </p>

                        <h2 className="text-sm font-semibold text-gray-700 mb-2">
                            Resend Verification Email
                        </h2>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 ${resendError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                                }`}
                        />
                        <button
                            onClick={handleResend}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
                        >
                            Resend
                        </button>
                        {resendMessage && (
                            <p
                                className={`mt-2 text-sm font-medium ${resendError ? "text-red-600" : "text-gray-600"
                                    }`}
                            >
                                {resendMessage}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
