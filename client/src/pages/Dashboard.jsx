// Dashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import UserBetsTable from '@/components/UserBetsTable';
import WinningStatsCard from '@/components/WinningStatsCard';
import api from '@/utils/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import WalletStatsGraph from '@/components/WalletStatsGraph';

export default function Dashboard() {
    const [bets, setBets] = useState([]);
    const [walletStats, setWalletStats] = useState([]);
    const [loadingBets, setLoadingBets] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const { data } = await api.get('/api/bet/fetch-bets-by-user');
                if (!data.success) console.error("Failed fetching bets");
                setBets(data.data || []);
            } catch (err) {
                console.error('Error fetching bets', err);
            } finally {
                setLoadingBets(false);
            }
        };

        const fetchWalletStats = async () => {
            try {
                const { data } = await api.get('/api/user/get-day-wise-wallet-stats');
                setWalletStats(data || []);
            } catch (err) {
                console.error('Error fetching wallet stats', err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchBets();
        fetchWalletStats();
    }, []);

    return (
        <>
            <Breadcrumbs />
            <div className="p-6 space-y-3 text-white min-h-screen w-screen lg:w-full">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <WinningStatsCard />
                {!loadingStats && <WalletStatsGraph data={walletStats} />}
                {loadingBets ? (
                    <div>Loading bets...</div>
                ) : (
                    <UserBetsTable bets={bets} />
                )}
            </div>
        </>
    );
}
