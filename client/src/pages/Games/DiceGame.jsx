// DiceGame.js
import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";

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

    const sliderRef = useRef(null);

    const houseEdge = 0.01;
    const winChance = condition === "above" ? 100 - target : target;
    const payoutMultiplier = Math.min(Math.max(((100 - houseEdge * 100) / winChance), 1.0102), 49.5).toFixed(2);

    const handleSliderChange = (e) => {
        setTarget(parseFloat(e.target.value));
    };

    const handleDrag = (e) => {
        if (!sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percent = (offsetX / rect.width) * 100;
        const clamped = Math.min(Math.max(percent, 2), 98);
        setTarget(parseFloat(clamped.toFixed(2)));
    };

    const handleMouseDown = () => {
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleMouseUp);
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

            setBet(res.data.bet);
            const updatedWallet = res.data.bet?.gameData?.diceRoll?.user?.wallet;

            if (typeof updatedWallet === "number") {
                setUser(prev => ({
                    ...prev,
                    wallet: updatedWallet
                }));
            }

            setResult(res.data.bet?.gameData?.diceRoll?.state?.result.toFixed(2));
        } catch (err) {
            console.error(err);
        } finally {
            setRollInProgress(false);
        }
    };

    return (
        <div className="p-6 text-white bg-[#0e1b26] min-h-screen">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Bet Amount"
                        className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                    />
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

                <div className="relative mt-10" ref={sliderRef}>
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

                        {/* Draggable Handle */}
                        <div
                            className="absolute top-0 z-10 -translate-x-1/2 cursor-pointer"
                            style={{ left: `${target}%` }}
                            onMouseDown={handleMouseDown}
                        >
                            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center shadow-lg z-50">
                                <div className="w-[2px] h-4 bg-blue-300 mx-[1px]" />
                                <div className="w-[2px] h-4 bg-blue-300 mx-[1px]" />
                                <div className="w-[2px] h-4 bg-blue-300 mx-[1px]" />
                            </div>
                        </div>

                        {/* Hidden Native Range for Keyboard Support */}
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

                <button
                    onClick={handleBet}
                    disabled={rollInProgress}
                    className="w-full py-3 mt-6 rounded bg-green-500 hover:bg-green-600 disabled:bg-gray-600"
                >
                    {rollInProgress ? "Rolling..." : "Bet"}
                </button>
            </div>
        </div>
    );
};

export default DiceGame;
