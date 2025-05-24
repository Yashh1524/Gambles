"use client";

import {
    X,
    Home,
    User,
    Gamepad,
    LogIn,
    UserPlus,
    LogOut,
    LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import api from "../utils/api";
import toast from "react-hot-toast";

function MenuForSmAndMd({ isOpen, setIsOpen }) {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogout = async () => {
        try {
            const res = await api.post("/api/user/logout");
            if (res?.data?.success) {
                toast.success("Logged out");
                setUser(null);
                setIsOpen(false);
                navigate("/");
            }
        } catch (err) {
            toast.error("Logout failed");
            console.error(err)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-64 bg-[#0F212E] text-white p-4 shadow h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-4 flex-1">
                    <button
                        onClick={() => handleNavigate("/")}
                        className="flex items-center gap-3 text-gray-300 hover:text-white"
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-sm">Home</span>
                    </button>

                    <button
                        onClick={() => handleNavigate("/games")}
                        className="flex items-center gap-3 text-gray-300 hover:text-white"
                    >
                        <Gamepad className="w-5 h-5" />
                        <span className="text-sm">Games</span>
                    </button>

                    {user && (
                        <>
                            <button
                                onClick={() => handleNavigate("/profile")}
                                className="flex items-center gap-3 text-gray-300 hover:text-white"
                            >
                                <User className="w-5 h-5" />
                                <span className="text-sm">Profile</span>
                            </button>
                            <button
                                onClick={() => handleNavigate("/dashboard")}
                                className="flex items-center gap-3 text-gray-300 hover:text-white"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span className="text-sm">Dashboard</span>
                            </button>
                        </>
                    )}
                </nav>

                {/* Auth Buttons */}
                {!user ? (
                    <div className="flex flex-col space-y-3 mt-6">
                        <button
                            onClick={() => handleNavigate("/login")}
                            className="flex items-center gap-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="text-sm">Login</span>
                        </button>
                        <button
                            onClick={() => handleNavigate("/register")}
                            className="flex items-center gap-3 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm">Register</span>
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 space-y-2">
                        {
                            !user.isVerified && (
                                <button
                                    onClick={() => navigate("/verify-user")}
                                    className="bg-[#1447E6] w-full flex items-center justify-start px-4 py-2 rounded text-white cursor-pointer gap-2"
                                >
                                    <FaUserClock size={20} />
                                    <span className="font-medium">Verify Account</span>
                                </button>
                            )
                        }
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Background click to close */}
            <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
    );
}

export default MenuForSmAndMd;
