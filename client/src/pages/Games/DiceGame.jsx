import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import UserBetsTable from "@/components/UserBetsTable";
import { ImSpinner2 } from "react-icons/im";
import GameSummaryAndBets from "@/components/GameSummaryAndBets";

const DiceGame = () => {
    const { state } = useLocation();
    const gameId = state?.gameId;

    const { user, setUser } = useUser();

    const [amount, setAmount] = useState(0);
    const [condition, setCondition] = useState("above");
    const [target, setTarget] = useState(50.5);
    const [result, setResult] = useState(null);
    const [bet, setBet] = useState({});
    const [rollInProgress, setRollInProgress] = useState(false);
    const [totalWinAmount, setTotalWinAmount] = useState(0)
    const [winningStreak, setWinningStreak] = useState(0)
    const [loadingWinningData, setLoadingWinningData] = useState(false)
    const [loadingBets, setLoadingBets] = useState(false)
    const [bets, setBets] = useState([])
    const [totalWageredAmount, setTotalWageredAmount] = useState(0)
    const [totalWins, setTotalWins] = useState(0)
    const [totalLose, setTotalLose] = useState(0)

    const sliderRef = useRef(null);

    const houseEdge = 0.01;
    const winChance = condition === "above" ? 100 - target : target;
    const payoutMultiplier = Math.min(Math.max(((100 - houseEdge * 100) / winChance), 1.0102), 49.5).toFixed(4);

    useEffect(() => {

        const fetchUserBetsByGame = async () => {
            try {
                setLoadingBets(true)
                const response = await api.get(`/api/bet/fetch-user-bet-by-game?gameId=${gameId || "6835bfab8200b1050f2716e1"}`)
                console.log("bets:", response)
                if (response.data?.success) {
                    setBets(response.data?.data)
                }
            } catch (error) {
                console.error("Error fetching bets:", error);
            } finally {
                setLoadingBets(false)
            }
        }

        const fetchTotalWinAndWinStreakByGame = async () => {
            try {
                setLoadingWinningData(true)
                const response = await api.get(
                    `/api/bet/get-user-totalwin-and-winningstreak-by-game?gameId=${gameId || "6835bfab8200b1050f2716e1"}`
                );
                // console.log(response)

                // Access data inside response.data
                const {
                    success,
                    totalWinningAmount,
                    totalWinningStreak,
                    totalWageredAmount,
                    totalWins,
                    totalLose
                } = response.data;

                if (!success)
                    throw new Error("Error while fetching total win and win streak data");

                setTotalWinAmount(totalWinningAmount);
                setWinningStreak(totalWinningStreak);
                setTotalWageredAmount(totalWageredAmount)
                setTotalWins(totalWins)
                setTotalLose(totalLose)
            } catch (error) {
                console.error("Error fetching total win and win streak:", error);
            } finally {
                setLoadingWinningData(false)
            }
        };

        fetchTotalWinAndWinStreakByGame();
        fetchUserBetsByGame()
    }, []);

    const clampTarget = (val) => Math.min(Math.max(val, 2), 98);

    const handleSliderChange = (e) => {
        setTarget(parseFloat(e.target.value));
    };

    const updateTargetFromPosition = (clientX) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const percent = (offsetX / rect.width) * 100;
        setTarget(clampTarget(parseFloat(percent.toFixed(2))));
    };

    const handleMouseDown = () => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        updateTargetFromPosition(e.clientX);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = () => {
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd);
    };

    const handleTouchMove = (e) => {
        e.preventDefault(); // prevent scroll while dragging
        updateTargetFromPosition(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
    };

    const handleBet = async () => {
        if (!user) return toast.error("Please login to play game");
        if (!user?.isVerified) return toast.error("Please verify account first.");
        if (!amount || amount <= 0) return toast.error("Enter a valid amount");

        setRollInProgress(true);
        try {
            const res = await api.post("/api/games/dice/roll-dice", {
                amount: parseFloat(amount),
                target,
                condition,
                gameId,
            });

            // console.log(res)
            setBet(res.data.bet);
            const updatedWallet = res.data.bet?.gameData?.diceRoll?.user?.wallet;

            if (typeof updatedWallet === "number") {
                setUser(prev => ({
                    ...prev,
                    wallet: updatedWallet
                }));
            }
            setBets(prev => [res.data.bet, ...prev])
            if (res.data.bet.isWin) {
                setTotalWinAmount(totalWinAmount + res.data.bet.winAmount - res.data.bet.betAmount)
                setTotalWins(totalWins + 1)
            } else {
                setWinningStreak(0)
                setTotalWinAmount(totalWinAmount - res.data.bet.betAmount)
                setTotalLose(totalLose + 1)
            }
            setTotalWageredAmount(totalWageredAmount + amount)

            setResult(res.data.bet?.gameData?.diceRoll?.state?.result.toFixed(2));
        } catch (err) {
            console.error(err);
        } finally {
            setRollInProgress(false);
        }
    };

    return (
        <div className="bg-[#0E1B26] min-h-screen">
            <div className=" text-white flex items-center flex-col">
                <div className="p-5 md:p-10 flex flex-col lg:flex-row w-full gap-10 max-w-7xl mx-auto">
                    {/* Left Panel */}
                    <div className="bg-[#132631] rounded-2xl p-6 w-full lg:h-[70vh] max-w-sm mx-auto shadow-md text-white">
                        <h2 className="text-2xl font-semibold mb-4 text-center">🎲 Dice</h2>
                        <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                <div className="bg-[#1e3a4c] p-3 rounded-lg shadow-inner text-white text-center">
                                    <p className="text-xs text-gray-300">Total Win</p>
                                    {
                                        loadingWinningData ? (
                                            <div className="flex justify-center pt-2">
                                                <ImSpinner2 className="animate-spin text-green-400" />
                                            </div>
                                        ) : (
                                            <p className={`text-lg font-bold ${totalWinAmount > 0 ? "text-green-400" : "text-red-500"}`}>₹{totalWinAmount.toFixed(2)}</p>
                                        )
                                    }
                                </div>
                                <div className="bg-[#1e3a4c] p-3 rounded-lg shadow-inner text-white text-center">
                                    <p className="text-xs text-gray-300">Winning Streak</p>
                                    {
                                        loadingWinningData ? (
                                            <div className="flex justify-center pt-2">
                                                <ImSpinner2 className="animate-spin text-yellow-400" />
                                            </div>
                                        ) : (
                                            <p className="text-lg font-bold text-yellow-300">{winningStreak}</p>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Bet Amount (₹)</label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="flex-1 p-2.5 rounded-md bg-[#1e3a4c] text-white border border-[#2a4a5c] focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={amount === 0 ? '' : amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setAmount(value === '' ? 0 : Number(value));
                                        }}
                                        onBlur={() => {
                                            setAmount((prev) => Number(Number(prev).toFixed(2)));
                                        }}
                                        onWheel={(e) => e.target.blur()} // Disable scroll change
                                        placeholder="Enter amount"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const halved = amount / 2;
                                                setAmount(Number(halved.toFixed(2)));
                                            }}
                                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-2 py-2 rounded-md transition-all disabled:opacity-50 text-sm"
                                        >
                                            1/2
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const doubled = amount * 2;
                                                const finalAmount = doubled > user.wallet ? user.wallet : doubled;
                                                setAmount(Number(finalAmount.toFixed(2)));
                                            }}
                                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-3 py-2 rounded-md transition-all disabled:opacity-50 text-sm"
                                        >
                                            2x
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() => setAmount(Number(user.wallet.toFixed(2)))}
                                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-2 py-2 rounded-md transition-all disabled:opacity-50 text-sm"
                                        >
                                            Max
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-2">
                                <button
                                    className={`px-4 py-2 rounded ${condition === "above" ? "bg-green-600" : "bg-gray-700"}`}
                                    onClick={() => setCondition("above")}
                                >
                                    Above
                                </button>
                                <button
                                    className={`px-4 py-2 rounded ${condition === "below" ? "bg-green-600" : "bg-gray-700"}`}
                                    onClick={() => setCondition("below")}
                                >
                                    Below
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleBet}
                            disabled={rollInProgress}
                            className="w-full py-2 mt-10 rounded bg-green-500 hover:bg-green-600 text-black font-bold shadow"
                        >
                            {rollInProgress ? "Rolling..." : "Bet"}
                        </button>
                    </div>

                    {/* Right Panel */}
                    <div className="w-full mx-auto space-y-6 select-none">
                        <div className="relative mt-10 lg:mt-50" ref={sliderRef}>
                            <div className="flex justify-between px-1 text-sm text-white/60">
                                {[0, 25, 50, 75, 100].map((val) => (
                                    <span key={val}>{val}</span>
                                ))}
                            </div>

                            <div className="relative h-6 mt-2 bg-[#243241] rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full flex">
                                    <div
                                        className={`h-full ${condition === "above" ? "bg-red-500" : "bg-green-500"}`}
                                        style={{ width: `${target}%` }}
                                    ></div>
                                    <div
                                        className={`h-full ${condition === "below" ? "bg-red-500" : "bg-green-500"}`}
                                        style={{ width: `${100 - target}%` }}
                                    ></div>
                                </div>

                                {/* Draggable Handle (Mouse + Touch) */}
                                <div
                                    className="absolute top-0 z-10 -translate-x-1/2 cursor-pointer"
                                    style={{ left: `${target}%` }}
                                    onMouseDown={handleMouseDown}
                                    onTouchStart={handleTouchStart}
                                >
                                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center shadow-lg">
                                        <div className="w-[2px] h-4 bg-blue-300 mx-[1px]" />
                                        <div className="w-[2px] h-4 bg-blue-300 mx-[1px]" />
                                        <div className="w-[2px] h-4 bg-blue-300 mx-[1px]" />
                                    </div>
                                </div>

                                {/* Hidden Native Range for accessibility */}
                                <input
                                    type="range"
                                    min="2"
                                    max="98"
                                    step="0.01"
                                    value={target}
                                    onChange={handleSliderChange}
                                    className="absolute top-0 w-full h-6 opacity-0 cursor-pointer"
                                />
                            </div>

                            {result && (
                                <div
                                    className="absolute -top-5 w-12 h-12 bg-white text-center rounded-md flex items-center justify-center text-sm rotate-45"
                                    style={{ left: `calc(${parseFloat(result)}% - 1.5rem)` }}
                                >
                                    <span className={`-rotate-45 ${bet.isWin ? "text-green-500" : "text-red-500"}`}>
                                        {result}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center mt-8">
                            <div>
                                <div className="text-xs text-white/60">Multiplier</div>
                                <div className="mt-1 p-2 bg-gray-800 rounded">{payoutMultiplier}</div>
                            </div>
                            <div>
                                <div className="text-xs text-white/60">Roll {condition === "above" ? "Over" : "Under"}</div>
                                <div className="mt-1 p-2 bg-gray-800 rounded">{target}</div>
                            </div>
                            <div>
                                <div className="text-xs text-white/60">Win Chance</div>
                                <div className="mt-1 p-2 bg-gray-800 rounded">{winChance.toFixed(4)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <GameSummaryAndBets
                    loadingWinningData={loadingWinningData}
                    loadingBets={loadingBets}
                    totalWageredAmount={totalWageredAmount}
                    totalWins={totalWins}
                    totalLose={totalLose}
                    bets={bets}
                />
            </div>
        </div>
    );
};

export default DiceGame;
