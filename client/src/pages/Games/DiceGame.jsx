// DiceGame.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../utils/api";

const DiceGame = () => {
    const { state } = useLocation();
    const gameId = state?.gameId;

    const [amount, setAmount] = useState(0);
    const [condition, setCondition] = useState("above");
    const [target, setTarget] = useState(50.5);
    const [result, setResult] = useState(null);
    const [rollInProgress, setRollInProgress] = useState(false);

    const houseEdge = 0.01;
    const winChance = condition === "above" ? 100 - target : target;
    const payoutMultiplier = ((100 - houseEdge) / winChance).toFixed(4);

    const handleSliderChange = (e) => {
        setTarget(parseFloat(e.target.value));
    };

    const handleBet = async () => {
        setRollInProgress(true);
        try {
            const res = await api.post("/api/games/dice/roll-dice", {
                amount: parseFloat(amount),
                target,
                condition,
                gameId,
            });
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
                            className={`px-4 py-2 rounded ${condition === "above" ? "bg-green-600" : "bg-gray-700"
                                }`}
                            onClick={() => setCondition("above")}
                        >
                            Above
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${condition === "below" ? "bg-green-600" : "bg-gray-700"
                                }`}
                            onClick={() => setCondition("below")}
                        >
                            Below
                        </button>
                    </div>
                </div>

                <div className="relative mt-10">
                    <div className="flex justify-between px-1 text-sm text-white/60">
                        {[0, 25, 50, 75, 100].map((val) => (
                            <span key={val}>{val}</span>
                        ))}
                    </div>

                    <div className="relative h-6 mt-2 rounded-full bg-[#243241]">
                        <div
                            className={`absolute top-0 left-0 h-6 ${condition === "below" ? "bg-green-500" : "bg-red-500"
                                }`}
                            style={{
                                width: `${condition === "below" ? target : 100 - target}%`,
                                borderTopLeftRadius: '9999px',
                                borderBottomLeftRadius: '9999px',
                                borderTopRightRadius: condition === "below" ? '0px' : '9999px',
                                borderBottomRightRadius: condition === "below" ? '0px' : '9999px',
                            }}
                        ></div>
                        <div
                            className={`absolute top-0 h-6 ${condition === "below" ? "bg-red-500" : "bg-green-500"
                                }`}
                            style={{
                                left: `${condition === "below" ? target : 0}%`,
                                width: `${condition === "below" ? 100 - target : target}%`,
                                borderTopRightRadius: '9999px',
                                borderBottomRightRadius: '9999px',
                                borderTopLeftRadius: condition === "below" ? '0px' : '9999px',
                                borderBottomLeftRadius: condition === "below" ? '0px' : '9999px',
                            }}
                        ></div>

                        <input
                            type="range"
                            min="0.01"
                            max="99.99"
                            step="0.01"
                            value={target}
                            onChange={handleSliderChange}
                            className="absolute top-0 w-full h-6 opacity-0 cursor-pointer"
                        />

                        {result && (
                            <div
                                className="absolute -top-12 w-12 h-12 bg-white text-center text-red-500 rounded-md flex items-center justify-center text-sm"
                                style={{ left: `calc(${result}% - 1.5rem)` }}
                            >
                                {result}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center mt-8">
                    <div>
                        <div className="text-xs text-white/60">Multiplier</div>
                        <div className="mt-1 p-2 bg-gray-800 rounded">{payoutMultiplier}</div>
                    </div>
                    <div>
                        <div className="text-xs text-white/60">Roll {condition === "above" ? "Under" : "Over"}</div>
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