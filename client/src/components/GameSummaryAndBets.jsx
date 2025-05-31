import React from "react";
import UserBetsTable from "@/components/UserBetsTable";

const GameSummaryAndBets = ({
    loadingWinningData,
    loadingBets,
    totalWageredAmount,
    totalWins,
    totalLose,
    bets,
}) => {
    return (
        <div className="w-screen lg:w-full px-10 flex flex-col gap-5">
            {/* Win/Wager Summary UI */}
            {loadingWinningData ? (
                <div className="text-white">Loading summary...</div>
            ) : (
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
