// mines.controller.js
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
        if (!user || user.wallet < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        user.wallet -= amount;
        await user.save();

        const game = await gameModel.findOne({ name: "mines" });

        const newBet = await betModel.create({
            user: userId,
            game: game._id,
            betAmount: amount,
            gameData: {
                mineCount: minesCount,
                game: "mines",
                revealedTiles: [],
                mineHits: 0,
                safeHits: 0
            },
            status: "pending",
        });

        res.status(201).json({ message: "Game started", bet: newBet._id, wallet: user.wallet });
    } catch (err) {
        res.status(500).json({ message: "Failed to start game" });
    }
};

export const revealTile = async (req, res) => {
    const { betId, tileIndex } = req.body;
    const userId = req.user.id;

    try {
        const bet = await betModel.findById(betId);
        if (!bet || bet.user.toString() !== userId || bet.status !== "pending") {
            return res.status(400).json({ message: "Invalid bet or already ended" });
        }

        if (bet.gameData.revealedTiles.includes(tileIndex)) {
            return res.status(400).json({ message: "Tile already revealed" });
        }

        const totalTiles = 25;
        const revealed = bet.gameData.revealedTiles.length;
        const remainingTiles = totalTiles - revealed;
        const remainingMines = bet.gameData.mineCount - (bet.gameData.mineHits || 0);

        const chanceOfMine = remainingMines / remainingTiles;
        // const isMine = Math.random() <= chanceOfMine; //100% fair
        const houseEdge = 0.99; // 1% house edge — tweak this if needed (e.g., 0.98 for 2%)
        const isMine = Math.random() <= (chanceOfMine * (1 / houseEdge));
        // console.log("chanceOfMine:", chanceOfMine)
        // console.log("isMine:", isMine)

        bet.gameData.revealedTiles.push(tileIndex);
        if (isMine) {
            bet.gameData.mineHits = (bet.gameData.mineHits || 0) + 1;
        } else {
            bet.gameData.safeHits = (bet.gameData.safeHits || 0) + 1;
        }

        bet.markModified("gameData");
        await bet.save();

        let winStatus = null;
        let multiplier = 1;
        let profit = 0;

        if (!isMine) {
            multiplier = getMinesMultiplier(bet.gameData.safeHits, bet.gameData.mineCount);
            profit = Number((bet.betAmount * multiplier).toFixed(2));

            if (bet.gameData.safeHits === totalTiles - bet.gameData.mineCount) {
                winStatus = "win";
            }
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
        return res.status(500).json({ message: "Reveal failed" });
    }
};

export const endMinesGame = async (req, res) => {
    const { betId } = req.body;
    const userId = req.user.id;

    try {
        const bet = await betModel.findById(betId);
        if (!bet || bet.user.toString() !== userId || bet.status !== "pending") {
            return res.status(400).json({ message: "Invalid or finished game" });
        }

        const user = await userModel.findById(userId);
        const { safeHits, mineHits, mineCount } = bet.gameData;
        let winAmount = 0;
        let isWin = false;

        if (!mineHits || mineHits === 0) {
            const multiplier = getMinesMultiplier(safeHits, mineCount);
            winAmount = Number((bet.betAmount * multiplier).toFixed(2));
            user.wallet += winAmount;
            await user.save();
            isWin = true;
        }

        bet.status = "completed";
        bet.isWin = isWin;
        bet.winAmount = winAmount;
        await bet.save();

        // Populate game.displayName after saving
        const populatedBet = await betModel.findById(bet._id).populate("game", "displayName");

        res.status(200).json({ message: "Game ended", wallet: user.wallet, bet: populatedBet });
        // res.status(200).json({ message: "Game ended", wallet: user.wallet, bet });
    } catch (err) {
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

        if (!pendingGame) return res.status(200).json({ message: "No pending game", bet: null });

        res.status(200).json({
            message: "Pending game found",
            bet: {
                _id: pendingGame._id,
                betAmount: pendingGame.betAmount,
                gameData: {
                    mineCount: pendingGame.gameData.mineCount,
                    revealedTiles: pendingGame.gameData.revealedTiles,
                },
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Error getting pending game" });
    }
};
