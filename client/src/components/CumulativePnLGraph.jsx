import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

const CumulativePnLGraph = ({ bets }) => {
    let cumulative = 0;

    // Sort bets by createdAt (ascending) to preserve time order
    const sortedBets = [...bets].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const formattedData = sortedBets.map((item, index) => {
        const net = item.isWin ? item.winAmount - item.betAmount : -item.betAmount;
        cumulative += net;

        return {
            bet: `#${index + 1}`,
            totalPnL: parseFloat(cumulative.toFixed(2)),
            profit: cumulative > 0 ? parseFloat(cumulative.toFixed(2)) : 0,
            loss: cumulative < 0 ? parseFloat(cumulative.toFixed(2)) : 0,
        };
    });

    const maxAbs = Math.max(...formattedData.map(d => Math.abs(d.totalPnL)));

    return (
        <div className="w-full h-96 bg-[#142732] rounded-2xl ">
            <h2 className="text-white text-xl font-semibold mb-4">Cumulative Profit / Loss</h2>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={formattedData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334e5c" />
                    <XAxis dataKey="bet" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" domain={[-maxAbs, maxAbs]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e2d3d', border: 'none', color: '#fff' }}
                        labelStyle={{ color: '#f0f0f0' }}
                        formatter={(value, name) => [`₹${value}`, name]}
                    />
                    <ReferenceLine y={0} stroke="#f59e0b" strokeDasharray="5 10" />
                    <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.3}
                        name="Profit"
                    />
                    <Area
                        type="monotone"
                        dataKey="loss"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                        name="Loss"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CumulativePnLGraph;
