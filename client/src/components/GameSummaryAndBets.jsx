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
    currentBets
}) => {
    const [activeTab, setActiveTab] = useState("Bets");
    const [currentBetsActiveTab, setCurrentBetsActiveTab] = useState("Bets");

    return (
        <div className="w-screen lg:w-full px-10 flex flex-col gap-5">
            {loadingWinningData ? (
                <div className="text-white">Loading summary...</div>
            ) : (
                <>
                    {/* Graph for current session's bets */}
                    <div className="bg-[#142732] rounded-2xl p-6 shadow-md space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-semibold text-white">Current Session's Bets</h1>

                            {/* Toggle Switch */}
                            <div className="bg-[#0f1f29] p-1 rounded-full flex border border-gray-700">
                                <button
                                    onClick={() => setCurrentBetsActiveTab("Bets")}
                                    className={`px-5 py-1.5 text-sm rounded-full transition-all duration-200 ${currentBetsActiveTab === "Bets"
                                        ? "bg-white text-black font-semibold shadow-sm"
                                        : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    Bets PnL
                                </button>
                                <button
                                    onClick={() => setCurrentBetsActiveTab("cumulative")}
                                    className={`px-5 py-1.5 text-sm rounded-full transition-all duration-200 ${currentBetsActiveTab === "cumulative"
                                        ? "bg-white text-black font-semibold shadow-sm"
                                        : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    Cumulative PnL
                                </button>
                            </div>
                        </div>


                        {/* Divider */}
                        <div className="border-t border-[#1f3847]"></div>

                        {/* Render Graph */}
                        <div className="w-full">
                            {currentBetsActiveTab === "Bets" ? (
                                <BetsPnLGraph bets={currentBets} />
                            ) : (
                                <CumulativePnLGraph bets={currentBets} />
                            )}
                        </div>
                    </div>
                    {/* Graph for all bets */}
                    <div className="bg-[#142732] rounded-2xl p-6 shadow-md space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-semibold text-white">All Bets</h1>

                            {/* Toggle Switch */}
                            <div className="bg-[#0f1f29] p-1 rounded-full flex border border-gray-700">
                                <button
                                    onClick={() => setActiveTab("Bets")}
                                    className={`px-5 py-1.5 text-sm rounded-full transition-all duration-200 ${activeTab === "Bets"
                                        ? "bg-white text-black font-semibold shadow-sm"
                                        : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    Bets PnL
                                </button>
                                <button
                                    onClick={() => setActiveTab("cumulative")}
                                    className={`px-5 py-1.5 text-sm rounded-full transition-all duration-200 ${activeTab === "cumulative"
                                        ? "bg-white text-black font-semibold shadow-sm"
                                        : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    Cumulative PnL
                                </button>
                            </div>
                        </div>


                        {/* Divider */}
                        <div className="border-t border-[#1f3847]"></div>

                        {/* Render Graph */}
                        <div className="w-full">
                            {activeTab === "Bets" ? (
                                <BetsPnLGraph bets={bets} />
                            ) : (
                                <CumulativePnLGraph bets={bets} />
                            )}
                        </div>
                    </div>

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
