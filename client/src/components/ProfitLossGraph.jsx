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

const ProfitLossGraph = ({ data }) => {
    const formattedData = data.map((item) => ({
        date: item.date,
        profit: item.netBetResult > 0 ? item.netBetResult : 0,
        loss: item.netBetResult < 0 ? item.netBetResult : 0,
    }));

    // Find max absolute value to center 0
    const maxAbs = Math.max(...data.map(d => Math.abs(d.netBetResult || 0)));

    return (
        <div className="w-full h-96 bg-[#142732] rounded-2xl p-10 pb-15 shadow-lg mb-10">
            <h2 className="text-white text-xl font-semibold mb-4">Daily Profit / Loss</h2>
            <ResponsiveContainer width="100%" height="98%">
                <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334e5c" />
                    <XAxis dataKey="date" stroke="#cbd5e1" />
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

export default ProfitLossGraph;
