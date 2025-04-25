import betModel from "../models/bet.model.js";

export const createBetController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gameType, betAmount, winAmount, isWin, gameData, status } = req.body;

        const newBet = await betModel.create({
            user: userId,
            gameType,
            betAmount,
            winAmount,
            isWin,
            gameData,
            status
        });

        res.status(201).json({
            success: true,
            data: newBet
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating bet",
            error: err.message
        });
    }
};

export const getAllBetsController = async (req, res) => {
    try {
        const bets = await betModel.find().populate("User"); // optional: populate user
        res.status(200).json({
            success: true,
            data: bets
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching bets",
            error: err.message
        });
    }
};

export const getUserBetsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const bets = await betModel.find({ user: userId });

        res.status(200).json({
            success: true,
            data: bets
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching user bets",
            error: err.message
        });
    }
};

export const getUserBetsByGameController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gameType } = req.body;

        const bets = await betModel.find({ user: userId, gameType });

        res.status(200).json({
            success: true,
            data: bets
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching user bets by game",
            error: err.message
        });
    }
};

export const updateBetController = async (req, res) => {
    try {
        const { betId } = req.params;
        const updates = req.body;

        const updatedBet = await betModel.findByIdAndUpdate(
            betId,
            updates,
            { new: true } // return the updated document
        );

        if (!updatedBet) {
            return res.status(404).json({
                success: false,
                message: "Bet not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedBet
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating bet",
            error: err.message
        });
    }
};
