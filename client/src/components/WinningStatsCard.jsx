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

    return (
        <div className="bg-[#1f2937] shadow-md p-4 rounded-xl border border-gray-700 text-white">
            <h2 className="text-lg font-bold mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm md:text-base">
                <div>
                    <h3 className="text-gray-400">Total Win</h3>
                    <p className={`text-xl font-bold ${totalWinningAmount >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        ₹{totalWinningAmount.toFixed(2)}
                    </p>
                </div>
                <div>
                    <h3 className="text-gray-400">Winning Streak</h3>
                    <p className="text-xl font-bold text-blue-400">{totalWinningStreak}</p>
                </div>
                <div>
                    <h3 className="text-gray-400">Total Wagered</h3>
                    <p className="text-xl font-bold text-yellow-400">₹{totalWageredAmount.toLocaleString()}</p>
                </div>
                <div>
                    <h3 className="text-gray-400">Total Wins</h3>
                    <p className="text-xl font-bold text-green-400">{totalWins}</p>
                </div>
                <div>
                    <h3 className="text-gray-400">Total Losses</h3>
                    <p className="text-xl font-bold text-red-400">{totalLose}</p>
                </div>
                <div>
                    <h3 className="text-gray-400">Win Rate</h3>
                    <p className="text-xl font-bold text-purple-400">{winRate}%</p>
                </div>
            </div>
        </div>
    );
}
