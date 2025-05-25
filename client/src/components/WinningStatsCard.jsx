'use client';
import api from '@/utils/api';
import React, { useEffect, useState } from 'react';

export default function WinningStatsCard() {
    const [stats, setStats] = useState({
        totalWinningAmount: 0,
        totalWinningStreak: 0,
        totalWins: 0,
        totalLose: 0,
        totalWageredAmount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/bet/get-user-totalwin-and-winningstreak');
                setStats(data);
            } catch (err) {
                console.error('Error fetching winning stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-white">Loading winning stats...</div>;

    const { totalWinningAmount, totalWinningStreak, totalWins, totalLose, totalWageredAmount } = stats;
    const totalBets = totalWins + totalLose;
    const winRate = totalBets > 0 ? ((totalWins / totalBets) * 100).toFixed(2) : '0.00';

    const StatCard = ({ label, value, color }) => (
        <div className="bg-[#111827] p-4 rounded-lg shadow border border-gray-700 flex flex-col justify-between">
            <h3 className="text-gray-400 text-sm md:text-base">{label}</h3>
            <p className={`text-lg md:text-2xl font-semibold ${color || 'text-white'}`}>{value}</p>
        </div>
    );

    return (
        <div className="bg-[#1f2937] shadow-lg p-5 rounded-2xl border border-gray-700 text-white w-full mx-auto">
            <h2 className="text-lg md:text-xl font-bold mb-6">Your Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                    label="Total Win"
                    value={`₹${totalWinningAmount.toLocaleString()}`}
                    color={totalWinningAmount >= 0 ? 'text-green-400' : 'text-red-500'}
                />
                <StatCard label="Winning Streak" value={totalWinningStreak} color="text-blue-400" />
                <StatCard label="Total Wagered" value={`₹${totalWageredAmount.toLocaleString()}`} color="text-yellow-400" />
                <StatCard label="Total Wins" value={totalWins} color="text-green-400" />
                <StatCard label="Total Losses" value={totalLose} color="text-red-400" />
                <StatCard label="Win Rate" value={`${winRate}%`} color="text-purple-400" />
            </div>
        </div>
    );
}
