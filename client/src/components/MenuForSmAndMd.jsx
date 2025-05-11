"use client";

import { X, LayoutDashboard, User, Settings, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useUser } from "../contexts/UserContext";

function MenuForSmAndMd({ isOpen, setIsOpen }) {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-64 bg-[#0F212E] text-white p-4 shadow h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="space-y-4 flex-1">
                    <button
                        onClick={() => {
                            navigate("/");
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 text-gray-300 hover:text-white"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-sm">Dashboard</span>
                    </button>

                    {user && (
                        <button
                            onClick={() => {
                                navigate("/profile");
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 text-gray-300 hover:text-white"
                        >
                            <User className="w-5 h-5" />
                            <span className="text-sm">Profile</span>
                        </button>
                    )}

                    <button
                        onClick={() => {
                            navigate("/settings");
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 text-gray-300 hover:text-white"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="text-sm">Settings</span>
                    </button>
                </nav>

                {!user ? (
                    <div className="flex flex-col space-y-3 mt-6">
                        <button
                            onClick={() => {
                                navigate("/login");
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="text-sm">Login</span>
                        </button>
                        <button
                            onClick={() => {
                                navigate("/register");
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm">Register</span>
                        </button>
                    </div>
                ) : (
                    <div className="mt-6">
                        <LogoutButton
                            onLogout={() => {
                                setUser(null);
                                setIsOpen(false);
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                        />
                    </div>
                )}
            </div>
            <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
    );
}

export default MenuForSmAndMd;
