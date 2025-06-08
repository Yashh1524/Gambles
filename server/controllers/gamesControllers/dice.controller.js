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
        // console.log("rollResult", rollResult)
        // console.log("target", target)
        // console.log("condition", condition)
        // console.log(isWin)
        const payout = isWin ? parseFloat((amount * payoutMultiplier).toFixed(2)) : 0;

        // Update wallet based on win or loss
        if (isWin && payout > 0) {
            user.wallet += payout;
        }
        await user.save();

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
                    wallet: user.wallet
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
            isWin,
            status: "completed",
        });

        // Populate game.displayName after creation
        const populatedBet = await betModel.findById(newBet._id).populate("game", "displayName");

        res.status(200).json({ message: "Bet placed", bet: populatedBet });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};
