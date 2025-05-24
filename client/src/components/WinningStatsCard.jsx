'use client';
import api from '@/utils/api';
import React, { useEffect, useState } from 'react';

export default function WinningStatsCard() {
    const [stats, setStats] = useState({ totalWinningAmount: 0, totalWinningStreak: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/bet/get-user-totalwin-and-winningstreak');
                setStats(data);
                // console.log(data)
            } catch (err) {
                console.error('Error fetching winning stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-white">Loading winning stats...</div>;

    return (
        <div className="bg-[#1f2937] shadow-md p-4 rounded-xl flex justify-between gap-4 border border-gray-700">
            <div>
                <h3 className="text-sm text-gray-400">Total Win</h3>
                <p className={`text-2xl font-bold ${stats.totalWinningAmount >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                    ₹{stats.totalWinningAmount.toFixed(2)}
                </p>
            </div>
            <div>
                <h3 className="text-sm text-gray-400">Winning Streak</h3>
                <p className="text-2xl font-bold text-blue-400">{stats.totalWinningStreak}</p>
            </div>
        </div>
    );
}
