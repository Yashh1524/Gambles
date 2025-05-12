import transactionModel from "../models/transaction.model.js";
import userModel from "../models/user.model.js";

export const createTransactionController = async (req, res) => {
    try {
        const { amount, type, accountNumber, ifscCode, accountHolderName, upiId } = req.body;

        if (!amount || amount <= 0 || !type || !["DEPOSIT", "WITHDRAW"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Valid amount and transaction type are required."
            });
        }

        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (type === "WITHDRAW") {
            if (!upiId && (!accountNumber || !ifscCode || !accountHolderName)) {
                return res.status(400).json({
                    success: false,
                    message: "Bank details or UPI ID required for withdrawal."
                });
            }

            if (user.wallet < amount) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient wallet balance."
                });
            }
        }

        const transactionData = {
            user: userId,
            amount,
            type,
            status: "PENDING"
        };

        if (type === "WITHDRAW") {
            transactionData.bankDetails = accountNumber && ifscCode && accountHolderName ? {
                accountHolderName,
                ifscCode,
                accountNumber,
            } : undefined;
            transactionData.upiId = upiId || undefined;
        }

        const newTransaction = await transactionModel.create(transactionData);

        return res.status(201).json({
            success: true,
            message: "Transaction request created successfully.",
            transactionId: newTransaction._id,
            status: newTransaction.status
        });

    } catch (error) {
        console.error("Error creating transaction:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the transaction."
        });
    }
};
