import React, { useState } from "react";
import UserBetsTable from "@/components/UserBetsTable";
import BetsPnLGraph from "./BetsPnLGraph";
import CumulativePnLGraph from "./CumulativePnLGraph";

const GameSummaryAndBets = ({
    loadingWinningData,
    loadingBets,
    totalWageredAmount,
    totalWins,
    totalLose,
    bets,
}) => {
    const [activeTab, setActiveTab] = useState("Bets");

    return (
        <div className="w-screen lg:w-full px-10 flex flex-col gap-5">
            {loadingWinningData ? (
                <div className="text-white">Loading summary...</div>
            ) : (
                <>
                    {/* Toggle Graph Switch */}
                    <div className="bg-[#132631] p-1 rounded-full w-max flex">
                        <button
                            onClick={() => setActiveTab("Bets")}
                            className={`px-4 py-1 rounded-full text-sm transition-all duration-200 ${
                                activeTab === "Bets"
                                    ? "bg-white text-black font-semibold"
                                    : "text-gray-400"
                            }`}
                        >
                            Bets PnL
                        </button>
                        <button
                            onClick={() => setActiveTab("cumulative")}
                            className={`px-4 py-1 rounded-full text-sm transition-all duration-200 ${
                                activeTab === "cumulative"
                                    ? "bg-white text-black font-semibold"
                                    : "text-gray-400"
                            }`}
                        >
                            Cumulative PnL
                        </button>
                    </div>

                    {/* Render Graph */}
                    {activeTab === "Bets" ? (
                        <BetsPnLGraph bets={bets} />
                    ) : (
                        <CumulativePnLGraph bets={bets} />
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-white">
                        <div className="bg-[#1A2934] p-4 rounded-lg shadow-md border border-gray-900">
                            <h4 className="text-sm text-gray-400">Total Wagered</h4>
                            <p className="text-lg font-semibold text-blue-400">
                                ₹{totalWageredAmount.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-[#1A2934] p-4 rounded-lg shadow-md border border-gray-900">
                            <h4 className="text-sm text-gray-400">Total Wins</h4>
                            <p className="text-lg font-semibold text-green-400">{totalWins}</p>
                        </div>
                        <div className="bg-[#1A2934] p-4 rounded-lg shadow-md border border-gray-900">
                            <h4 className="text-sm text-gray-400">Total Losses</h4>
                            <p className="text-lg font-semibold text-red-400">{totalLose}</p>
                        </div>
                        <div className="bg-[#1A2934] p-4 rounded-lg shadow-md border border-gray-900">
                            <h4 className="text-sm text-gray-400">Win Rate</h4>
                            <p className="text-lg font-semibold text-yellow-400">
                                {totalWins + totalLose > 0
                                    ? ((totalWins / (totalWins + totalLose)) * 100).toFixed(1)
                                    : "0.0"}%
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Bet History Table */}
            <div className="text-white bg-[#111827] w-full">
                {loadingBets ? (
                    <div>Loading bets...</div>
                ) : (
                    <UserBetsTable bets={bets} />
                )}
            </div>
        </div>
    );
};

export default GameSummaryAndBets;
