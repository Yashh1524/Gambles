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
        const bets = await betModel.find().populate("user", "name email picture isVerified wallet");
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
        const bets = await betModel.find({ user: userId }).sort({createdAt: -1});

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

export const getUserTotalWinningAmountAndWinningStreak = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const bets = await betModel
            .find({ user: userId, status: "completed" })
            .sort({ createdAt: -1 });

        let totalWinningAmount = 0;
        let totalWinningStreak = 0;
        let totalWageredAmount = 0;
        let totalWins = 0;
        let totalLose = 0;

        let calculatingStreak = true;
        for (const bet of bets) {
            totalWageredAmount += bet.betAmount;

            if (bet.isWin) {
                totalWins += 1
                totalWinningAmount += (bet.winAmount - bet.betAmount);
                if (calculatingStreak) totalWinningStreak += 1;
            } else {
                totalLose += 1
                totalWinningAmount -= bet.betAmount;
                calculatingStreak = false; // break streak count
            }
        }

        // for (const bet of bets) {
        //     console.log(bet)
        //     if (bet.isWin) totalWinningAmount += bet.winAmount;
        //     else totalWinningAmount -= bet.betAmount;
        // }

        // for (const bet of bets) {
        //     if (bet.isWin) totalWinningStreak += 1;
        //     else break;
        // }

        return res.status(200).json({
            totalWinningAmount,
            totalWinningStreak,
            totalWageredAmount,
            totalWins,
            totalLose,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving user stats",
            error: error.message,
        });
    }
};

export const getUserTotalWinningAmountAndWinningStreakByGame = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gameId } = req.query;
        
        const bets = await betModel
            .find({ user: userId, status: "completed", game: gameId })
            .sort({ createdAt: -1 });

        let totalWinningAmount = 0;
        let totalWinningStreak = 0;
        let totalWageredAmount = 0;
        let totalWins = 0;
        let totalLose = 0;

        let calculatingStreak = true;
        for (const bet of bets) {
            totalWageredAmount += bet.betAmount;

            if (bet.isWin) {
                totalWins += 1
                totalWinningAmount += (bet.winAmount - bet.betAmount);
                if (calculatingStreak) totalWinningStreak += 1;
            } else {
                totalLose += 1
                totalWinningAmount -= bet.betAmount;
                calculatingStreak = false; // break streak count
            }
        }

        // for (const bet of bets) {
        //     console.log(bet)
        //     if (bet.isWin) totalWinningAmount += bet.winAmount;
        //     else totalWinningAmount -= bet.betAmount;
        // }

        // for (const bet of bets) {
        //     if (bet.isWin) totalWinningStreak += 1;
        //     else break;
        // }

        return res.status(200).json({
            totalWinningAmount,
            totalWinningStreak,
            totalWageredAmount,
            totalWins,
            totalLose,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving user stats",
            error: error.message,
        });
    }
};
