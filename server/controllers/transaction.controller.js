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

export const updateTransactionStatusController = async (req, res) => {
    try {
        const { transactionId, status } = req.body;

        if (!transactionId || !status || !["SUCCESS", "FAILED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Transaction ID and valid status (SUCCESS or FAILED) are required."
            });
        }

        const transaction = await transactionModel.findById(transactionId).populate("user");

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found." });
        }

        if (transaction.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only PENDING transactions can be updated."
            });
        }

        const user = transaction.user;

        // Update wallet balance if needed
        if (status === "SUCCESS" && transaction.type === "DEPOSIT") {
            user.wallet += transaction.amount;
            await user.save();
        }

        transaction.status = status;
        await transaction.save();

        return res.status(200).json({
            success: true,
            message: `Transaction marked as ${status}.`,
            wallet: user.wallet,
            transactionId: transaction._id
        });

    } catch (error) {
        console.error("Error updating transaction status:", error);

        // Attempt to mark the transaction as FAILED if possible
        if (req.body.transactionId) {
            try {
                const transaction = await transactionModel.findById(req.body.transactionId);
                if (transaction && transaction.status === "PENDING") {
                    transaction.status = "FAILED";
                    await transaction.save();
                }
            } catch (innerErr) {
                console.error("Error marking transaction as FAILED:", innerErr);
            }
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the transaction status."
        });
    }
};


export const getAllTransactionByUserId = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "No user found."
            })
        }

        const transactions = await transactionModel.find({user: userId}).sort({createdAt: -1}) 
        
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the transaction."
        });
    }

}