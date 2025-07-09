'use client';
import React, { useEffect, useState } from 'react';
import UserTransactionsTable from '@/components/UserTransactionsTable';
import { useUser } from '@/contexts/UserContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Profile() {
    const { user } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoadingTransactions(true);
                const response = await api.get("/api/transaction/get-all-transaction-by-user-id");
                if (!response.data.success) {
                    console.error("Failed fetching transactions");
                    return;
                }
                setTransactions(response.data.data);
            } catch (error) {
                console.error('Error fetching transactions', error);
                toast.error("Failed to fetch transactions.");
            } finally {
                setLoadingTransactions(false);
            }
        };

        fetchTransactions();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0f1b24] flex items-center justify-center text-white text-xl">
                Login to view profile
            </div>
        );
    }

    const StatCard = ({ label, value, color }) => (
        <div className="bg-[#1a2934] p-4 rounded-lg shadow flex flex-col justify-between">
            <h3 className="text-gray-400 text-sm md:text-base">{label}</h3>
            <p className={`text-lg md:text-2xl font-semibold ${color || 'text-white'}`}>{value}</p>
        </div>
    );

    return (
        <div className='bg-[#0f1b24]'>
            <Breadcrumbs />
            <div className="min-h-screen w-screen lg:w-full bg-[#0f1b24] py-5 lg:px-4 text-white">
                {/* Profile Card */}
                <div className="bg-[#0F212E] rounded-2xl shadow-lg p-6 md:p-10 mb-5 border border-gray-900">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                        <img
                            src={user?.picture}
                            alt="Profile Picture"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 shadow-md"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-xs text-green-400 mt-1 capitalize">Signed in with: {user.provider}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Member since: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            label="Wallet Balance"
                            value={`₹${user.wallet.toLocaleString()}`}
                            color="text-green-400"
                        />
                        <StatCard
                            label="Account Verified"
                            value={user.isVerified ? "Yes" : "No"}
                            color={user.isVerified ? "text-green-400" : "text-red-500"}
                        />
                        <StatCard
                            label="User ID"
                            value={user._id?.slice(-6).toUpperCase() || 'N/A'}
                            color="text-blue-400"
                        />
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="space-y-3 w-screen lg:w-full">
                    {loadingTransactions ? (
                        <div className="text-gray-400">Loading transactions...</div>
                    ) : (
                        <UserTransactionsTable transactions={transactions} />
                    )}
                </div>
            </div>
        </div>
    );
}
