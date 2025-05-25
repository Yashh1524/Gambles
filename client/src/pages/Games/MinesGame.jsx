// MinesGame.jsx (refactored)
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import { ImSpinner2 } from "react-icons/im";
import { useLocation } from "react-router-dom";
import UserBetsTable from "@/components/UserBetsTable";

const MinesGame = () => {

    const location = useLocation();
    const { gameId } = location.state || {};
    // console.log(gameId)

    const [amount, setAmount] = useState(0);
    const [minesCount, setMinesCount] = useState(3);
    const [grid, setGrid] = useState(Array(25).fill(null));
    const [revealedTiles, setRevealedTiles] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentProfit, setCurrentProfit] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [betId, setBetId] = useState(null);
    const [explodedBombIndex, setExplodedBombIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [endGameLoading, setEndGameLoading] = useState(false);
    const [totalWinAmount, setTotalWinAmount] = useState(0)
    const [winningStreak, setWinningStreak] = useState(0)
    const [loadingWinningData, setLoadingWinningData] = useState(false)
    const [loadingBets, setLoadingBets] = useState(false)
    const [bets, setBets] = useState([])
    const [totalWageredAmount, setTotalWageredAmount] = useState(0)
    const [totalWins, setTotalWins] = useState(0)
    const [totalLose, setTotalLose] = useState(0)

    const { user, setUser } = useUser();

    const diamondSoundRef = useRef(null);
    const bombSoundRef = useRef(null);

    const playDiamondSound = () => {
        if (diamondSoundRef.current) {
            diamondSoundRef.current.volume = 0.1;
            diamondSoundRef.current.currentTime = 0;
            diamondSoundRef.current.play();
        }
    };

    const playBombSound = () => {
        if (bombSoundRef.current) {
            bombSoundRef.current.volume = 0.2;
            bombSoundRef.current.currentTime = 0;
            bombSoundRef.current.play();
        }
    };

    useEffect(() => {

        const fetchUserBetsByGame = async () => {
            try {
                setLoadingBets(true)
                const response = await api.get(`/api/bet/fetch-user-bet-by-game?gameId=${gameId}`)
                // console.log("bets:", response)
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
                    `/api/bet/get-user-totalwin-and-winningstreak-by-game?gameId=${gameId || "6822f03212a5549e72f26829"}`
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


    useEffect(() => {
        const fetchPendingGame = async () => {
            if (!user || !user.isVerified) {
                return
            };
            try {
                const { data } = await api.get("/api/games/mines/pending-mine");
                const pendingBet = data.bet;
                if (pendingBet) {
                    const revealed = pendingBet.gameData.revealedTiles;
                    const amt = pendingBet.betAmount;

                    setGrid(prev => {
                        const newGrid = [...prev];
                        revealed.forEach(idx => newGrid[idx] = "💎");
                        return newGrid;
                    });
                    setRevealedTiles(revealed);
                    setIsGameStarted(true);
                    setBetId(pendingBet._id);
                    setAmount(amt);
                    setMinesCount(pendingBet.gameData.mineCount);
                    setMultiplier(1);
                    setCurrentProfit(0);
                }
            } catch (err) {
                console.error("Error checking pending game:", err);
            }
        };
        fetchPendingGame();
    }, [user]);

    const startGame = async () => {
        if (!user) return toast.error("Please login to play game")
        if (!user?.isVerified) return toast.error("Please verify account first.");
        if (!amount || amount <= 0) return toast.error("Enter a valid amount");
        setLoading(true);

        try {
            const { data } = await api.post("/api/games/mines/start-mine", { amount, minesCount });
            // console.log(data)
            setBetId(data.bet);
            setGrid(Array(25).fill(null));
            setRevealedTiles([]);
            setIsGameStarted(true);
            setCurrentProfit(0);
            setMultiplier(1);
            setExplodedBombIndex(null);
            setUser(prev => ({ ...prev, wallet: data.wallet }));
            toast.success("Game started");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to start game");
        } finally {
            setLoading(false);
        }
    };

    const handleTileClick = async (index) => {
        if (!isGameStarted || revealedTiles.includes(index)) return;
        try {
            const { data } = await api.patch("/api/games/mines/reveal-tile", { betId, tileIndex: index });
            const { isMine, revealedTiles: updated, status, multiplier, profit } = data;

            setGrid(prev => {
                const newGrid = [...prev];
                newGrid[index] = isMine ? "💣" : "💎";
                return newGrid;
            });
            setRevealedTiles(updated);
            setMultiplier(multiplier);
            setCurrentProfit(profit);

            if (isMine) {
                playBombSound();
                setExplodedBombIndex(index);
                toast.error("You hit a mine!");
                await endGame(false);
            } else {
                playDiamondSound();
                if (status === "win") {
                    toast.success(`You won ₹${profit} by revealing all safe tiles!`);
                    await endGame(true);
                }
            }
        } catch (err) {
            console.error("Reveal error:", err);
            toast.error("Reveal failed");
        }
    };

    const cashOut = async () => {
        setEndGameLoading(true);
        if (!isGameStarted || revealedTiles.length === 0) return;
        toast.success(`You won ₹${currentProfit}`);
        await endGame(true);
    };

    const endGame = async (won) => {
        if (!betId) return toast.error("Bet ID missing");
        try {
            const { data } = await api.post("/api/games/mines/end-mine", {
                betId
            });
            // console.log(data)
            const formattedBet = {
                _id: data.bet._id,
                betAmount: data.bet.betAmount,
                winAmount: data.bet.winAmount,
                status: data.bet.status,
                createdAt: data.bet.createdAt,
            }
            setTotalWageredAmount(totalWageredAmount + data.bet.betAmount)
            setBets(prevBets => [formattedBet, ...prevBets]);
            if (won) {
                setTotalWinAmount(totalWinAmount + data.bet.winAmount - data.bet.betAmount)
                setWinningStreak(winningStreak + 1)
                setTotalWins(totalWins + 1)
            } else {
                setTotalWinAmount(totalWinAmount - data.bet.betAmount)
                setWinningStreak(0)
                setTotalLose(totalLose + 1)
            }
            setUser(prev => ({ ...prev, wallet: data.wallet }));
        } catch (err) {
            console.error("End game error:", err);
        } finally {
            setEndGameLoading(false);
            setIsGameStarted(false);
            setMultiplier(1);
            setCurrentProfit(0);
            setBetId(null);
        }
    };

    return (
        <div className="min-h-full bg-[#0f1b24]">
            <div className=" text-white flex items-center px-4 py-6 flex-col gap-10">
                <div className="flex flex-col lg:flex-row w-full gap-10 max-w-7xl mx-auto">
                    {/* Left Panel */}
                    <div className="bg-[#132631] rounded-2xl p-6 w-full max-w-sm mx-auto shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">💣 Mines Game</h2>

                        <div className="mb-4">
                            <div className="grid grid-cols-2 gap-2 mb-4">
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
                                        disabled={isGameStarted}
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            disabled={isGameStarted}
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
    disabled={isGameStarted}
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
                                            disabled={isGameStarted}
                                            onClick={() => setAmount(Number(user.wallet.toFixed(2)))}
                                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-2 py-2 rounded-md transition-all disabled:opacity-50 text-sm"
                                        >
                                            Max
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-sm text-gray-300">Mines</label>
                            <select
                                className="w-full p-2 rounded bg-[#1e3a4c] text-white border border-[#2a4a5c] focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={minesCount}
                                onChange={(e) => setMinesCount(Number(e.target.value))}
                                disabled={isGameStarted}
                            >
                                {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!isGameStarted ? (
                            loading ? (
                                <button
                                    disabled
                                    className="w-full py-2 mt-2 rounded bg-green-500 text-black font-bold shadow flex items-center justify-center gap-2"
                                >
                                    <ImSpinner2 className="animate-spin" />
                                    Starting...
                                </button>
                            ) : (
                                <button
                                    onClick={startGame}
                                    disabled={loading}
                                    className="w-full py-2 mt-2 rounded bg-green-500 hover:bg-green-600 text-black font-bold shadow"
                                >
                                    Bet
                                </button>
                            )
                        ) : (
                            <>
                                <div className="text-sm mb-2">Revealed Tiles: {revealedTiles.length}</div>
                                <div className="text-sm">Multiplier: {multiplier}×</div>
                                <div className="text-sm text-green-400 font-bold mb-3">
                                    Current Win: ₹{currentProfit}
                                </div>

                                <button
                                    onClick={cashOut}
                                    disabled={endGameLoading}
                                    className="w-full py-2 mb-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow"
                                >
                                    {!endGameLoading ? (
                                        "Cash Out"
                                    ) : (
                                        <ImSpinner2 className="animate-spin mx-auto" />
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        const available = grid.map((val, idx) => (val === null ? idx : null)).filter((v) => v !== null);
                                        if (available.length > 0) {
                                            const randomIndex = available[Math.floor(Math.random() * available.length)];
                                            handleTileClick(randomIndex);
                                        }
                                    }}
                                    className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold shadow"
                                >
                                    Pick Random Tile
                                </button>
                            </>
                        )}
                    </div>

                    {/* Game Grid */}
                    <div className="grid grid-cols-5 gap-2 md:gap-3 justify-center mx-auto">
                        {grid.map((value, idx) => {
                            const isRevealed = revealedTiles.includes(idx);
                            const wasGameOver = !isGameStarted && value !== null;
                            const isExploded = idx === explodedBombIndex;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleTileClick(idx)}
                                    className={`w-13 h-13 sm:w-18 sm:h-18 lg:w-25 lg:h-25 rounded-lg flex items-center justify-center text-2xl font-bold cursor-pointer bg-[#2c3e4c] hover:bg-[#3b5365] shadow-sm transition-transform duration-200 ease-out
                                    ${wasGameOver ? "scale-100" : ""}
                                    ${value === "💣" && "bg-red-600 hover:bg-red-500"}
                                    ${value === "💎" && "bg-green-500 hover:bg-green-600"}
                                    ${isRevealed && "ring-4 ring-green-600"}
                                    ${isExploded ? "ring-4 ring-red-500 scale-110" : ""}
                                `}
                                >
                                    {value === "💣" && (
                                        <img
                                            src="/images/mines-game/bomb.svg"
                                            alt="Bomb"
                                            className="object-cover p-3"
                                        />
                                    )}
                                    {value === "💎" && (
                                        <img
                                            src="/images/mines-game/diamond.svg"
                                            alt="Diamond"
                                            className="object-cover p-3"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Sound elements */}
                <audio ref={diamondSoundRef} src="/sounds/diamond.mp3" preload="auto" />
                <audio ref={bombSoundRef} src="/sounds/bomb.mp3" preload="auto" />
            </div>
            <div className="w-screen lg:w-full p-10 flex flex-col gap-5">
                {/* Win/Wager Summary UI */}
                {loadingWinningData ? (
                    <div className="text-white">Loading summary...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-white">
                        <div className="bg-[#1A2934] p-4 rounded-lg shadow-md border border-gray-900">
                            <h4 className="text-sm text-gray-400">Total Wagered</h4>
                            <p className="text-lg font-semibold text-blue-400">₹{totalWageredAmount.toLocaleString()}</p>
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
        </div>
    );

};

export default MinesGame;