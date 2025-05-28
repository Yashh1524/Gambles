import betModel from "../../models/bet.model.js";
import gameModel from "../../models/game.model.js";
import userModel from "../../models/user.model.js";

export const rollDiceController = async (req, res) => {
    const { amount, condition, target } = req.body;
    const userId = req.user.id;

    if (!amount || !condition || target <= 0 || target >= 100 || !["above", "below"].includes(condition)) {
        return res.status(400).json({ message: "Invalid bet parameters" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user || user.wallet < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const game = await gameModel.findOne({ name: "dice" });

        // Deduct bet amount
        user.wallet -= amount;
        await user.save();

        // Roll the dice (0.00 - 99.99)
        const rollResult = parseFloat((Math.random() * 100).toFixed(2));

        // Apply house edge (e.g., 1%)
        // Apply house edge correctly as a percentage
        const houseEdgePercent = 0.01; // 1%
        const winChance = condition === "above" ? (100 - target) : target;
        const rawPayout = 100 / winChance;
        const payoutMultiplier = parseFloat((rawPayout * (1 - houseEdgePercent)).toFixed(4));

        // Determine win or loss
        const isWin = condition === "above" ? rollResult > target : rollResult < target;
        const payout = isWin ? parseFloat((amount * payoutMultiplier).toFixed(8)) : 0;

        // Credit payout if user won
        if (isWin && payout > 0) {
            user.wallet += payout;
            await user.save();
        }

        // Construct gameData without internal id
        const gameData = {
            diceRoll: {
                active: false,
                amountMultiplier: 1,
                payoutMultiplier,
                amount,
                payout,
                updatedAt: new Date().toUTCString(),
                game: "dice",
                user: {
                    id: user._id,
                    name: user.name,
                },
                state: {
                    result: rollResult,
                    target,
                    condition,
                }
            }
        };

        // Create bet
        const newBet = await betModel.create({
            user: userId,
            game: game._id,
            betAmount: amount,
            winAmount: payout,
            gameData,
            status: "completed",
        });

        res.status(200).json({ message: "Bet placed", bet: newBet });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};
