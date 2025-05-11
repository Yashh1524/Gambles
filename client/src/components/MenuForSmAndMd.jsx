"use client";

import { X, LayoutDashboard, User, Settings, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MenuForSmAndMd({ isOpen, setIsOpen, user }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-64 bg-white p-4 shadow h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-4 flex-1">
                    <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-sm">Dashboard</span>
                    </a>
                    {user && (
                        <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                            <User className="w-5 h-5" />
                            <span className="text-sm">Profile</span>
                        </a>
                    )}
                    <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="text-sm">Settings</span>
                    </a>
                </nav>

                {/* Auth Buttons */}
                {!user ? (
                    <div className="flex flex-col space-y-3 mt-6">
                        <button
                            onClick={() => {
                                navigate("/login");
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="text-sm">Login</span>
                        </button>
                        <button
                            onClick={() => {
                                navigate("/register");
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm">Register</span>
                        </button>
                    </div>
                ) : (
                    <p className="mt-6 text-sm text-gray-600">Hi, {user.name}</p>
                )}
            </div>

            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
    );
}

export default MenuForSmAndMd;
