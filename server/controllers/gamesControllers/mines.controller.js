// controllers/minesGame.controller.js
import userModel from "../../models/user.model.js";
import betModel from "../../models/bet.model.js";
import gameModel from "../../models/game.model.js";

export const startMinesGame = async (req, res) => {
    const { amount, minesCount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0 || minesCount < 1 || minesCount > 24) {
        return res.status(400).json({ message: "Invalid bet or mines count" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // console.log("Wallet:", user.wallet, "Amount:", amount)
        if (user.wallet < amount) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        user.wallet -= amount;
        await user.save();

        const game = await gameModel.findOne({ name: "mines" });
        if (!game) return res.status(404).json({ message: "Game not found" });

        const allTiles = Array.from({ length: 25 }, (_, i) => i);
        const shuffled = allTiles.sort(() => 0.5 - Math.random());
        const minePositions = shuffled.slice(0, minesCount);

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

        // console.log(newBet)

        res.status(201).json({
            message: "Mines game started",
            bet: newBet,
            wallet: user.wallet, // return updated wallet
        });
    } catch (err) {
        console.error("Mines game error:", err);
        res.status(500).json({ message: "Failed to start game" });
    }
};

export const endMinesGame = async (req, res) => {
    const { betId, status, revealedTiles } = req.body;
    const userId = req.user.id;

    if (!betId || !["win", "lose"].includes(status)) {
        return res.status(400).json({ message: "Invalid game result" });
    }

    try {
        const bet = await betModel.findById(betId);
        if (!bet || bet.user.toString() !== userId) {
            return res.status(404).json({ message: "Bet not found" });
        }

        if (bet.status !== "pending") {
            return res.status(400).json({ message: "Game already finished" });
        }

        bet.status = "completed";
        bet.gameData.revealedTiles = revealedTiles;

        let winAmount = 0;

        const user = await userModel.findById(userId);
        if (status === "win") {
            const mineCount = bet.gameData.mineCount;
            const safeTiles = 25 - mineCount;
            const base = 1.1;
            const multiplier = 1 + (revealedTiles.length / safeTiles) * base;
            winAmount = Number((bet.betAmount * multiplier).toFixed(2));

            user.wallet += winAmount;
            await user.save();

            bet.isWin = true;
            bet.winAmount = winAmount;
        } else {
            bet.isWin = false;
            bet.winAmount = 0;
        }

        await bet.save();

        res.status(200).json({
            message: "Game finished",
            result: status,
            winAmount,
            wallet: user.wallet, // return updated wallet
        });
    } catch (err) {
        console.error("Finish mines game error:", err);
        res.status(500).json({ message: "Error finishing game" });
    }
};

export const getPendingGame = async (req, res) => {
    const userId = req.user.id;

    try {
        const game = await gameModel.findOne({ name: "mines" });
        if (!game) return res.status(404).json({ message: "Game not found" });

        const pendingGame = await betModel.findOne({
            user: userId,
            game: game._id,
            status: "pending",
        });

        if (!pendingGame) {
            return res.status(200).json({ message: "No pending game", bet: null });
        }

        res.status(200).json({ message: "Pending game found", bet: pendingGame });
    } catch (err) {
        console.error("Get pending mines game error:", err);
        res.status(500).json({ message: "Error fetching pending game" });
    }
};

// controllers/minesGame.controller.js

export const revealTile = async (req, res) => {
    const { betId, tileIndex } = req.body;
    const userId = req.user.id;
    // console.log("betId:", betId, "tileIndex:", tileIndex, "userId:", userId);
    try {
        const bet = await betModel.findById(betId);
        // console.log(bet)
        if (!bet || bet.user.toString() !== userId) {
            return res.status(404).json({ message: "Bet not found" });
        }

        if (bet.status !== "pending") {
            return res.status(400).json({ message: "Game already ended" });
        }

        if (!bet.gameData.revealedTiles.includes(tileIndex)) {
            bet.gameData.revealedTiles.push(tileIndex);
            bet.markModified('gameData'); // Mark gameData as modified
            await bet.save();
        }

        res.status(200).json({ message: "Tile revealed", revealedTiles: bet.gameData.revealedTiles });
    } catch (err) {
        console.error("Reveal tile error:", err);
        res.status(500).json({ message: "Failed to update revealed tile" });
    }
};
