import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js"

export default function RegisterPage() {

    const navigate = useNavigate()

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                `${import.meta.env.VITE_API_URL}/api/user/register`,
                userData,
                { withCredentials: true }
            );

            // console.log("response:", response);

            if (!response?.data?.success) {
                toast.error(response?.data?.message);
            } else {
                toast.success(response?.data?.message);
                navigate("/")
                window.location.reload();
            }
        } catch (error) {
            console.error("Registration failed:", error);
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
                    Create your account
                </h1>

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-2 border rounded-md bg-transparent"
                        />
                    </div>

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
                        Register
                    </button>
                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Log in
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
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}
                        className="flex items-center justify-center w-full gap-2 border px-4 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                        <FcGoogle className="text-xl" />
                        <span>Continue with Google</span>
                    </button>

                    <button
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`}
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
