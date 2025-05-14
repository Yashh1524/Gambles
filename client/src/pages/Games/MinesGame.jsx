import React, { useState, useRef, useEffect } from "react";
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
    const [explodedBombIndex, setExplodedBombIndex] = useState(null);

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
        const fetchPendingGame = async () => {
            if (!user || !user.isVerified) return;

            try {
                const { data } = await api.get("/api/games/mines/pending-mine");
                const pendingBet = data.bet;
                console.log(data)
                if (pendingBet) {
                    const mines = pendingBet.gameData.minePositions;
                    const revealed = pendingBet.gameData.revealedTiles;
                    const amt = pendingBet.betAmount;

                    const newMultiplier = getMultiplier(revealed.length, pendingBet.gameData.mineCount);
                    const profit = (amt * newMultiplier).toFixed(2);

                    setMinePositions(mines);
                    setGrid(prev => {
                        const newGrid = [...prev];
                        revealed.forEach(idx => {
                            newGrid[idx] = "💎";
                        });
                        return newGrid;
                    });
                    setRevealedTiles(revealed);
                    setIsGameStarted(true);
                    setBetId(pendingBet._id);
                    setAmount(amt);
                    setMinesCount(pendingBet.gameData.mineCount);
                    setMultiplier(newMultiplier);
                    setCurrentProfit(parseFloat(profit));

                    // toast.success("Resumed pending game");
                }
            } catch (err) {
                console.error("Error checking pending game:", err);
            }
        };

        fetchPendingGame();
    }, [user]);

    const startGame = async () => {
        if (!user?.isVerified) return toast.error("Please verify account first.");
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
            setExplodedBombIndex(null);

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

    const handleTileClick = async (index) => {
        if (!isGameStarted || revealedTiles.includes(index)) return;

        const isMine = minePositions.includes(index);

        // Reveal locally for instant feedback
        setGrid(prev => {
            const newGrid = [...prev];
            newGrid[index] = isMine ? "💣" : "💎";
            return newGrid;
        });

        if (isMine) {
            setExplodedBombIndex(index);
            playBombSound();
            toast.error("You hit a mine!");
            await endGame(false);
        } else {
            playDiamondSound();
            const newRevealed = [...revealedTiles, index];
            setRevealedTiles(newRevealed);

            const newMultiplier = getMultiplier(newRevealed.length, minesCount);
            const profit = (amount * newMultiplier).toFixed(2);
            setMultiplier(newMultiplier);
            setCurrentProfit(parseFloat(profit));

            try {
                await api.patch("/api/games/mines/reveal-tile", {
                    betId,
                    tileIndex: index,
                });
            } catch (err) {
                console.error("Failed to sync tile reveal:", err);
                toast.error("Failed to update server with revealed tile");
            }

            // ✅ Auto cashout if all safe tiles revealed
            if (newRevealed.length === 25 - minesCount) {
                toast.success(`You won ₹${profit} by revealing all safe tiles!`);
                await endGame(true);
            }
        }

    };

    // const getMultiplier = (safeRevealed, mines) => {
    //     const safeTiles = 25 - mines;
    //     const base = 1.1;
    //     return Number((1 + (safeRevealed / safeTiles) * base).toFixed(2));
    // };

    const getMultiplier = (safeRevealed, mines) => {
        const totalTiles = 25;
        const houseEdge = 0.99; // 1% house edge

        if (safeRevealed === 0) return 1;

        let probability = 1;
        for (let i = 0; i < safeRevealed; i++) {
            probability *= (totalTiles - mines - i) / (totalTiles - i);
        }

        const multiplier = (1 / probability) * houseEdge;
        return Number(multiplier.toFixed(2));
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

        } catch (err) {
            console.error("End game error:", err);
            toast.error("Failed to end game");
        }

        setGrid(prev => {
            return prev.map((val, idx) => {
                if (minePositions.includes(idx)) return "💣";
                if (revealedTiles.includes(idx)) return "💎";
                return val;
            });
        });

        setIsGameStarted(false);
        setMultiplier(1);
        setCurrentProfit(0);
        setBetId(null);
    };

    return (
        <div className="min-h-full bg-[#0f1b24] text-white flex items-center px-4 py-6">
            <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
                {/* Left Panel */}
                <div className="bg-[#132631] rounded-2xl p-6 w-full max-w-sm mx-auto shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-center">💣 Mines Game</h2>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm text-gray-300">Bet Amount (₹)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="flex-1 p-2.5 rounded-md bg-[#1e3a4c] text-white border border-[#2a4a5c] focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="Enter amount"
                                disabled={isGameStarted}
                            />
                            <button
                                type="button"
                                disabled={isGameStarted}
                                onClick={() => setAmount(user.wallet)}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50"
                            >
                                Max
                            </button>
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
                <div className="grid grid-cols-5 gap-2 md:gap-3 justify-center mx-auto">
                    {grid.map((value, idx) => {
                        const isMine = minePositions.includes(idx);
                        const isRevealed = revealedTiles.includes(idx);
                        const wasGameOver = !isGameStarted && value !== null;
                        const isExploded = idx === explodedBombIndex;

                        return (
                            <div
                                key={idx}
                                onClick={() => handleTileClick(idx)}
                                className={`w-13 h-13 sm:w-18 sm:h-18 lg:w-25 lg:h-25 rounded-lg flex items-center justify-center text-2xl font-bold cursor-pointer bg-[#2c3e4c] hover:bg-[#3b5365] shadow-sm transition-transform duration-200 ease-out
                                    ${wasGameOver ? "scale-100" : ""}
                                    ${value === "💣" && "bg-red-600"}
                                    ${value === "💎" && "bg-green-500"}
                                    ${isRevealed && "ring-4 ring-green-300"}
                                    ${!isRevealed && isMine && !isGameStarted && !isExploded ? "opacity-40" : ""}
                                    ${isExploded ? "ring-4 ring-red-500 scale-110" : ""}
                                `}
                            >
                                {value === "💣" && (
                                    <img src="/assets/bomb.svg" alt="Bomb" className="w-8 h-8 sm:w-10 sm:h-10" />
                                )}
                                {value === "💎" && (
                                    <img src="/assets/diamond.svg" alt="Diamond" className="w-8 h-8 sm:w-10 sm:h-10" />
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
    );
};

export default MinesGame;