import payoutModel from "../models/payout.model.js";
import userModel from "../models/user.model.js";

export const createPayOutController = async (req, res) => {
    try {
        const { amount, accountNumber, ifscCode, accountHolderName, upiId } = req.body;

        // Validate input
        if (!amount || amount <= 0 || (!accountNumber && !upiId)) {
            return res.status(400).json({
                success: false,
                message: "Amount and either bank details or UPI ID are required."
            });
        }

        const userId = req.user.id; // assuming authentication middleware
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.wallet < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance in wallet."
            });
        }

        // Create payout object according to schema
        const payoutData = {
            user: userId,
            amount,
            bankDetails: accountNumber && ifscCode && accountHolderName ? {
                accountHolderName,
                ifscCode,
                accountNumber,
            } : undefined,
            upiId: upiId || undefined,
            status: 'PENDING'
        };

        const newPayout = await payoutModel.create(payoutData);

        return res.status(201).json({
            success: true,
            message: "Payout request created successfully. Awaiting processing.",
            payoutId: newPayout._id,
            status: newPayout.status
        });

    } catch (error) {
        console.error("Error creating payout:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the payout request."
        });
    }
};
