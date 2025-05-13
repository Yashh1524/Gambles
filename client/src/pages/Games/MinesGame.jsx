import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
import { useUser } from "@/contexts/UserContext";

const MinesGame = () => {
    const [amount, setAmount] = useState(0);
    const [minesCount, setMinesCount] = useState(3);
    const [grid, setGrid] = useState(Array(25).fill(null));
    const [minePositions, setMinePositions] = useState([]);
    const [revealedTiles, setRevealedTiles] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentProfit, setCurrentProfit] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [betId, setBetId] = useState(null);

    const { user, setUser } = useUser();

    const startGame = async () => {
        if (!amount || amount <= 0) return toast.error("Enter a valid amount");

        try {
            const { data } = await api.post("/api/games/mines/start-mine", {
                amount,
                minesCount,
            });

            const mines = data.bet.gameData.minePositions;
            setMinePositions(mines);
            setBetId(data.bet._id);
            setGrid(Array(25).fill(null));
            setRevealedTiles([]);
            setIsGameStarted(true);
            setCurrentProfit(0);
            setMultiplier(1);

            // Update wallet from server response
            setUser(prev => ({ ...prev, wallet: data.wallet }));

            toast.success("Game started");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to start game");
        }
    };

    const pickRandomTile = () => {
        const available = grid
            .map((val, idx) => (val === null ? idx : null))
            .filter((v) => v !== null);

        if (available.length === 0) return;

        const randomIndex = available[Math.floor(Math.random() * available.length)];
        handleTileClick(randomIndex);
    };

    const handleTileClick = (index) => {
        if (!isGameStarted || revealedTiles.includes(index)) return;

        if (minePositions.includes(index)) {
            setGrid(prev => {
                const newGrid = [...prev];
                newGrid[index] = "💣";
                return newGrid;
            });
            toast.error("You hit a mine!");
            endGame(false);
        } else {
            setGrid(prev => {
                const newGrid = [...prev];
                newGrid[index] = "💎";
                return newGrid;
            });

            const newRevealed = [...revealedTiles, index];
            setRevealedTiles(newRevealed);

            const newMultiplier = getMultiplier(newRevealed.length, minesCount);
            const profit = (amount * newMultiplier).toFixed(2);
            setMultiplier(newMultiplier);
            setCurrentProfit(profit);
        }
    };

    const getMultiplier = (safeRevealed, mines) => {
        const safeTiles = 25 - mines;
        const base = 1.1;
        return Number((1 + (safeRevealed / safeTiles) * base).toFixed(2));
    };

    const cashOut = async () => {
        if (!isGameStarted || revealedTiles.length === 0) return;
        toast.success(`You won ₹${currentProfit}`);
        endGame(true);
    };

    const endGame = async (won) => {
        if (!betId) return toast.error("Bet ID not found");

        try {
            const { data } = await api.post("/api/games/mines/end-mine", {
                status: won ? "win" : "lose",
                revealedTiles,
                betId,
            });

            if (data.wallet !== undefined) {
                setUser(prev => ({ ...prev, wallet: data.wallet }));
            }

            if (won) {
                toast.success(`Game won! You earned ₹${data.winAmount}`);
            } else {
                toast.error("You lost the game!");
            }
        } catch (err) {
            console.error("End game error:", err);
            toast.error("Failed to end game");
        }

        setIsGameStarted(false);
        setMultiplier(1);
        setCurrentProfit(0);
        setRevealedTiles([]);
        setMinePositions([]);
        setBetId(null);
    };

    return (
        <div className="h-full bg-[#0f1b24] text-white flex justify-center items-center">
            <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">

                {/* Left Panel */}
                <div className="bg-[#132631] rounded-2xl p-6 w-full max-w-sm shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-center">💣 Mines Game</h2>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm text-gray-300">Bet Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded bg-[#1e3a4c] text-white border border-[#2a4a5c] focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            placeholder="Enter amount"
                            disabled={isGameStarted}
                        />
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
                        <button
                            onClick={startGame}
                            className="w-full py-2 mt-2 rounded bg-green-500 hover:bg-green-600 text-black font-bold shadow"
                        >
                            Bet
                        </button>
                    ) : (
                        <>
                            <div className="text-sm mb-2">Revealed Tiles: {revealedTiles.length}</div>
                            <div className="text-sm">Multiplier: {multiplier}×</div>
                            <div className="text-sm text-green-400 font-bold mb-3">
                                Current Win: ₹{currentProfit}
                            </div>

                            <button
                                onClick={cashOut}
                                className="w-full py-2 mb-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow"
                            >
                                Cash Out
                            </button>

                            <button
                                onClick={pickRandomTile}
                                className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold shadow"
                            >
                                Pick Random Tile
                            </button>
                        </>
                    )}
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-5 gap-3 mx-auto sm:mx-0">
                    {grid.map((value, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleTileClick(idx)}
                            className={`w-14 h-14 sm:w-20 sm:h-20 md:w-30 md:h-30 rounded-lg flex items-center justify-center text-2xl font-bold cursor-pointer bg-[#2c3e4c] hover:bg-[#3b5365] shadow-sm transition-all duration-200
                            ${value === "💣" && "bg-red-600 text-white"}
                            ${value === "💎" && "bg-green-500 text-black"}`}
                        >
                            {value === "💣" && (
                                <img src="/assets/bomb.svg" alt="Bomb" className="w-8 h-8 sm:w-15 sm:h-15" />
                            )}
                            {value === "💎" && (
                                <img src="/assets/diamond.svg" alt="Diamond" className="w-8 h-8 sm:w-10 sm:h-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default MinesGame;
