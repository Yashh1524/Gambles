'use client';
import { useUser } from '@/contexts/UserContext';
import React from 'react';

export default function Profile() {
    const { user } = useUser();

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0f1b24] flex items-center justify-center text-white text-xl">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1b24] py-10 px-4 text-white">
            <div className="max-w-4xl mx-auto bg-[#132631] rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={user?.picture}
                        alt="Profile Picture"
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 shadow-md"
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="text-xs text-green-400 mt-1 capitalize">Signed in with: {user.provider}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-[#1e3a4c] p-4 rounded-lg shadow-inner">
                        <h3 className="text-sm text-gray-300">Wallet Balance</h3>
                        <p className="text-xl font-bold text-green-400">₹{user.wallet.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#1e3a4c] p-4 rounded-lg shadow-inner">
                        <h3 className="text-sm text-gray-300">Account Verified</h3>
                        <p className={`text-xl font-bold ${user.isVerified ? "text-green-400" : "text-red-500"}`}>
                            {user.isVerified ? "Yes" : "No"}
                        </p>
                    </div>
                </div>

                {/* Timestamps */}
                <div className="text-sm text-gray-500 text-center mt-4">
                    Member since: {new Date(user.createdAt).toLocaleDateString()} <br />
                </div>
            </div>
        </div>
    );
}
