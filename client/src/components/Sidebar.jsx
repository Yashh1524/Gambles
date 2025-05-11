"use client";

import { useState } from "react";
import {
    ChevronsLeft,
    ChevronsRight,
    LayoutDashboard,
    User,
    Settings,
    LogIn,
    UserPlus,
} from "lucide-react";

export default function Sidebar({ user }) {
    const [isDesktopOpen, setIsDesktopOpen] = useState(true); // Only for lg+

    return (
        <aside
            className={`hidden lg:flex flex-col bg-white h-full shadow-md transition-all duration-300 
            ${isDesktopOpen ? "w-64" : "w-16"} relative`}
        >
            <nav className="flex-1 p-4 space-y-4">
                {/* Dashboard */}
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                    {isDesktopOpen && <span className="text-sm">Dashboard</span>}
                </a>

                {/* Show Profile only if user is logged in */}
                {user && (
                    <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                        <User className="w-5 h-5" />
                        {isDesktopOpen && <span className="text-sm">Profile</span>}
                    </a>
                )}

                {/* Settings */}
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                    <Settings className="w-5 h-5" />
                    {isDesktopOpen && <span className="text-sm">Settings</span>}
                </a>

                {/* If user is not logged in: show Login/Register vertically */}
                {!user && (
                    <div className="flex flex-col space-y-3 pt-6">
                        <a
                            href="/login"
                            className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <LogIn className="w-5 h-5" />
                            {isDesktopOpen && <span className="text-sm">Login</span>}
                        </a>
                        <a
                            href="/register"
                            className="flex items-center gap-3 text-green-600 hover:text-green-800 transition-colors"
                        >
                            <UserPlus className="w-5 h-5" />
                            {isDesktopOpen && <span className="text-sm">Register</span>}
                        </a>
                    </div>
                )}
            </nav>

            {/* Toggle button */}
            <button
                onClick={() => setIsDesktopOpen(prev => !prev)}
                className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow p-1 z-50"
            >
                {isDesktopOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
            </button>
        </aside>
    );
}
