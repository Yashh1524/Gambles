
// mines.controller.js (refactored)
import userModel from "../../models/user.model.js";
import betModel from "../../models/bet.model.js";
import gameModel from "../../models/game.model.js";
import { getMinesMultiplier } from "../../utils/getMultipliers.js";

export const startMinesGame = async (req, res) => {
    const { amount, minesCount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0 || minesCount < 1 || minesCount > 24) {
        return res.status(400).json({ message: "Invalid bet or mines count" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.wallet < amount) return res.status(400).json({ message: "Insufficient balance" });

        user.wallet -= amount;
        await user.save();

        const game = await gameModel.findOne({ name: "mines" });
        if (!game) return res.status(404).json({ message: "Game not found" });

        const allTiles = Array.from({ length: 25 }, (_, i) => i);
        const minePositions = allTiles.sort(() => 0.5 - Math.random()).slice(0, minesCount);

        const newBet = await betModel.create({
            user: userId,
            game: game._id,
            betAmount: amount,
            gameData: {
                mineCount: minesCount,
                minePositions,
                revealedTiles: [],
            },
            status: "pending",
        });

        res.status(201).json({ message: "Game started", bet: newBet._id, wallet: user.wallet });
    } catch (err) {
        console.error("startMinesGame error:", err);
        res.status(500).json({ message: "Failed to start game" });
    }
};

export const revealTile = async (req, res) => {
    const { betId, tileIndex } = req.body;
    const userId = req.user.id;

    try {
        const bet = await betModel.findById(betId);
        if (!bet || bet.user.toString() !== userId) {
            return res.status(404).json({ message: "Bet not found" });
        }

        if (bet.status !== "pending") {
            return res.status(400).json({ message: "Game ended" });
        }

        if (bet.gameData.revealedTiles.includes(tileIndex)) {
            return res.status(400).json({ message: "Tile already revealed" });
        }

        const isMine = bet.gameData.minePositions.includes(tileIndex);
        bet.gameData.revealedTiles.push(tileIndex);
        bet.markModified("gameData");
        await bet.save();

        const mineCount = bet.gameData.mineCount;
        const safeTiles = 25 - mineCount;
        const revealedSafe = bet.gameData.revealedTiles.filter(
            i => !bet.gameData.minePositions.includes(i)
        ).length;

        let winStatus = null;
        let multiplier = 1;
        let profit = 0;

        if (!isMine) {
            multiplier = getMinesMultiplier(revealedSafe, mineCount);
            profit = Number((bet.betAmount * multiplier).toFixed(2));
            if (revealedSafe === safeTiles) winStatus = "win";
        }

        return res.status(200).json({
            message: "Tile revealed",
            isMine,
            revealedTiles: bet.gameData.revealedTiles,
            status: winStatus,
            multiplier,
            profit,
        });
    } catch (err) {
        console.error("revealTile error:", err);
        return res.status(500).json({ message: "Reveal failed" });
    }
};

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

export const endMinesGame = async (req, res) => {
    const { betId } = req.body;
    const userId = req.user.id;

    try {
        const bet = await betModel.findById(betId);
        if (!bet || bet.user.toString() !== userId)
            return res.status(404).json({ message: "Bet not found" });
        if (bet.status !== "pending")
            return res.status(400).json({ message: "Already finished" });

        const { minePositions, revealedTiles, mineCount } = bet.gameData;
        const user = await userModel.findById(userId);

        const hitMine = revealedTiles.some(tile => minePositions.includes(tile));
        let winAmount = 0;
        let isWin = false;

        if (!hitMine) {
            // console.log(revealedTiles.length)
            const safeRevealed = revealedTiles.length;
            const multiplier = getMultiplier(safeRevealed, mineCount);

            winAmount = Number((bet.betAmount * multiplier).toFixed(2));
            user.wallet += winAmount;
            await user.save();

            isWin = true;
        }

        bet.status = "completed";
        bet.isWin = isWin;
        bet.winAmount = winAmount;
        await bet.save();

        res.status(200).json({
            message: "Game ended",
            wallet: user.wallet,
            bet
        });

    } catch (err) {
        console.error("endMinesGame error:", err);
        res.status(500).json({ message: "Error ending game" });
    }
};

export const getPendingGame = async (req, res) => {
    const userId = req.user.id;
    try {
        const game = await gameModel.findOne({ name: "mines" });
        const pendingGame = await betModel.findOne({
            user: userId,
            game: game._id,
            status: "pending",
        });

        if (!pendingGame) {
            return res.status(200).json({ message: "No pending game", bet: null });
        }

        // Return only safe fields
        const safeData = {
            _id: pendingGame._id,
            betAmount: pendingGame.betAmount,
            gameData: {
                mineCount: pendingGame.gameData.mineCount,
                revealedTiles: pendingGame.gameData.revealedTiles,
            },
        };

        res.status(200).json({ message: "Pending game found", bet: safeData });
    } catch (err) {
        console.error("getPendingGame error:", err);
        res.status(500).json({ message: "Error getting pending game" });
    }
};
