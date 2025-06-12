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

const BetsPnLGraph = ({ bets }) => {
    const formattedData = bets.map((item, index) => {
        const netBetResult = item.isWin ? item.winAmount - item.betAmount : -item.betAmount;
        return {
            bet: `#${index + 1}`,
            profit: netBetResult > 0 ? netBetResult.toFixed(2) : 0,
            loss: netBetResult < 0 ? netBetResult.toFixed(2) : 0,
        };
    }).reverse();

    const maxAbs = Math.max(
        ...formattedData.map((d) => Math.abs(d.profit || d.loss || 0))
    );

    return (
        <div className="w-full h-96 bg-[#142732] rounded-2xl">
            <h2 className="text-white text-xl font-semibold mb-4">Bet-wise Profit / Loss</h2>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={formattedData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334e5c" />
                    <XAxis dataKey="" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" domain={[-maxAbs, maxAbs]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e2d3d', border: 'none', color: '#fff' }}
                        labelStyle={{ color: '#f0f0f0' }}
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

export default BetsPnLGraph;
