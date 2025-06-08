// WalletStatsGraph.jsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

const WalletStatsGraph = ({ data }) => {
    return (
        <div className="w-full h-96 bg-[#142732] rounded-2xl p-5 shadow-lg mb-10">
            <h2 className="text-white text-xl font-semibold mb-4">Wallet Overview</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <ReferenceLine y={0} stroke="#f59e0b" strokeDasharray="5 10" label={{ position: 'insideRight', fill: '#f59e0b' }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334e5c" />
                    <XAxis dataKey="date" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e2d3d', border: 'none', color: '#fff' }}
                        labelStyle={{ color: '#f0f0f0' }}
                    />
                    <Legend wrapperStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="walletAmount" stroke="#10b981" strokeWidth={2} name="Actual Wallet Balance(Deposit/Withdraw)" />
                    <Line type="monotone" dataKey="actualWalletAfterBets" stroke="#3b82f6" strokeWidth={2} name="Wallet Balance After Bets" />
                    {data.some(item => item.netBetResult !== undefined) && (
                        <Line type="monotone" dataKey="netBetResult" stroke="#f43f5e" strokeWidth={2} name="Daily Profit/Loss" />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WalletStatsGraph;
