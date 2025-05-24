'use client';
import React, { useEffect, useState } from 'react';
import UserBetsTable from '@/components/UserBetsTable';
import WinningStatsCard from '@/components/WinningStatsCard';
import api from '@/utils/api';

export default function Profile() {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const { data } = await api.get('/api/bet/fetch-bets-by-user');
                setBets(data.data || []);
            } catch (err) {
                console.error('Error fetching bets', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBets();
    }, []);

    return (
        <div className="p-6 space-y-6 text-white bg-[#111827] min-h-screen">
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
            <WinningStatsCard />
            {loading ? (
                <div>Loading bets...</div>
            ) : (
                <UserBetsTable bets={bets} />
            )}
        </div>
    );
}
