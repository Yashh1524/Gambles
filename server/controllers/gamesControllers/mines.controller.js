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

        // Get user from DB
        const user = await userModel.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.wallet < amount) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        // Deduct amount from wallet
        user.wallet -= amount;
        await user.save();

        const game = await gameModel.findOne({ name: "mines" });
        if (!game) return res.status(404).json({ message: "Game not found" });

        // Generate random mine positions (5x5 = 25 tiles)
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

        res.status(201).json({
            message: "Mines game started",
            bet: newBet,
        });
    } catch (err) {
        console.error("Mines game error:", err);
        res.status(500).json({ message: "Failed to start game" });
    }
};
