import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useUser } from "../contexts/UserContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/api/user/login", userData, {
                withCredentials: true,
            });

            if (!response?.data?.success) {
                toast.error(response?.data?.message || "Login failed");
                return;
            }

            toast.success(response.data.message);

            const userRes = await api.get("/api/user/my-details", { withCredentials: true });
            setUser(userRes.data.data);

            navigate("/");
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-semibold text-center text-gray-900">
                    Log in to your account
                </h1>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
                    >
                        Log In
                    </button>

                    <div className="flex justify-between items-center text-sm mb-4">
                        <span></span>
                        <span
                            onClick={() => navigate("/forgot-password")}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Forgot password?
                        </span>
                    </div>

                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Register
                        </span>
                    </p>
                </form>

                <div className="flex items-center gap-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-sm text-gray-500">or</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() =>
                            window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
                        }
                        className="flex items-center justify-center w-full gap-2 border px-4 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                        <FcGoogle className="text-xl" />
                        <span>Continue with Google</span>
                    </button>

                    <button
                        onClick={() =>
                            window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`
                        }
                        className="flex items-center justify-center w-full gap-2 border px-4 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                        <FaGithub className="text-xl" />
                        <span>Continue with GitHub</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
