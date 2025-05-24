"use client";

import { useState } from "react";
import {
    User,
    LogIn,
    UserPlus,
    Menu,
    LogOut,
    Home,
    Gamepad,
    LayoutDashboard
} from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from 'react-hot-toast';
import { FaUserClock } from "react-icons/fa";

export default function Sidebar() {
    const [isDesktopOpen, setIsDesktopOpen] = useState(true);
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const menuItemClass =
        "flex items-center gap-3 px-4 py-3 rounded cursor-pointer text-gray-300 hover:bg-[#1A2A36] transition-all";

    const handleLogout = async () => {
        try {
            const response = await api.post("/api/user/logout");

            if (response?.data?.success) {
                toast.success("Logged out successfully");
                setUser(null); // Reset user state in context
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
        }
    };

    return (
        <aside
            className={`hidden lg:flex flex-col bg-[#0F212E] h-screen transition-all duration-300 shadow-md ${isDesktopOpen ? "w-60" : "w-16"
                } relative`}
        >
            {/* Top bar with menu icon */}
            <div className="px-4 py-2 shadow-xl h-[8vh] text-white flex items-center gap-5">
                <button onClick={() => setIsDesktopOpen((prev) => !prev)}>
                    <Menu className="h-7 w-7" />
                </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-2 mt-10 space-y-2">
                <div
                    onClick={() => navigate("/")}
                    className={menuItemClass}
                >
                    <Home className="w-5 h-5 shrink-0" />
                    {isDesktopOpen && (
                        <span className="text-sm font-medium">Home</span>
                    )}
                </div>

                {user && (
                    <>
                        <div
                            onClick={() => navigate("/profile")}
                            className={menuItemClass}
                        >
                            <User className="w-5 h-5 shrink-0" />
                            {isDesktopOpen && (
                                <span className="text-sm font-medium">Profile</span>
                            )}
                        </div>
                        <div
                            onClick={() => navigate("/dashboard")}
                            className={menuItemClass}
                        >
                            <LayoutDashboard className="w-5 h-5 shrink-0" />
                            {isDesktopOpen && (
                                <span className="text-sm font-medium">Dashboard</span>
                            )}
                        </div>
                    </>
                )}

                <div
                    onClick={() => navigate("/games")}
                    className={menuItemClass}
                >
                    <Gamepad className="w-5 h-5 shrink-0" />
                    {isDesktopOpen && (
                        <span className="text-sm font-medium">Games</span>
                    )}
                </div>

                {/* Auth Buttons */}
                {!user ? (
                    <div className="flex flex-col space-y-3 pt-6 px-2">
                        <button
                            onClick={() => navigate("/login")}
                            className={`${isDesktopOpen
                                    ? "flex items-center justify-center lg:justify-start gap-3 px-4 py-3 w-full text-white bg-blue-600 hover:bg-blue-700 rounded text-sm transition-all"
                                    : "flex items-center justify-center px-2 py-3 bg-blue-600 rounded-md text-white"
                                }`}
                        >
                            <LogIn className="w-5 h-5" />
                            {isDesktopOpen && <span className="font-medium">Login</span>}
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className={`${isDesktopOpen
                                    ? "flex items-center justify-center lg:justify-start gap-3 px-4 py-3 w-full text-white bg-green-600 hover:bg-green-700 rounded text-sm transition-all"
                                    : "flex items-center justify-center px-2 py-3 bg-green-600 rounded-md text-white"
                                }`}
                        >
                            <UserPlus className="w-5 h-5" />
                            {isDesktopOpen && <span className="font-medium">Register</span>}
                        </button>
                    </div>
                ) : (
                    <div className="px-2 pt-6 space-y-2">
                        {
                            !user.isVerified && (
                                <button
                                    onClick={() => navigate("/verify-user")}
                                    className="bg-[#1447E6] w-full flex items-center justify-start px-4 py-2 rounded text-white cursor-pointer gap-2"
                                >
                                    <FaUserClock size={20} />
                                    {isDesktopOpen && <span className="font-medium">Verify Account</span>}
                                </button>
                            )
                        }
                        <button
                            onClick={handleLogout}
                            className={`${isDesktopOpen
                                    ? "flex items-center justify-center lg:justify-start gap-3 px-4 py-3 w-full text-white bg-red-600 hover:bg-red-700 rounded text-sm transition-all"
                                    : "flex items-center justify-center px-2 py-3 bg-red-600 rounded-md text-white"
                                }`}
                        >
                            <LogOut className="w-5 h-5" />
                            {isDesktopOpen && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                )}
            </nav>
        </aside>
    );
}
