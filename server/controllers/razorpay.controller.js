import transactionModel from "../models/transaction.model.js";
import { razorpayPost } from "../utils/razorpay.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createDepositOrderController = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user?.id;

        // console.log("User in request:", req.user);

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount." });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID." });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${userId.slice(-5)}`, // Safe under 40 chars
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);

        const transaction = await transactionModel.create({
            user: new mongoose.Types.ObjectId(userId), // Ensure ObjectId
            amount,
            type: "DEPOSIT",
            razorpayOrderId: order.id,
        });

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            transactionId: transaction._id,
        });

    } catch (error) {
        console.error("Create Deposit Order Error:", error.message || error);
        return res.status(500).json({ success: false, message: "Failed to create deposit order." });
    }
};

export const verifyDepositPaymentController = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount
        } = req.body;

        const userId = req.user.id;

        // Step 1: Find the corresponding transaction
        const transaction = await transactionModel.findOne({
            user: userId,
            razorpayOrderId: razorpay_order_id,
            type: "DEPOSIT",
            status: "PENDING"
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found or already processed." });
        }

        // Step 2: Validate the Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            transaction.status = "FAILED";
            await transaction.save();
            return res.status(400).json({ success: false, message: "Invalid signature. Payment verification failed." });
        }

        // Step 3: Update user's wallet
        const user = await userModel.findById(userId);
        if (!user) {
            transaction.status = "FAILED";
            await transaction.save();
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.wallet += amount;
        await user.save();

        // Step 4: Update transaction as successful
        transaction.status = "SUCCESS";
        transaction.razorpayPaymentId = razorpay_payment_id;
        await transaction.save();

        return res.status(200).json({
            success: true,
            message: "Deposit successful.",
            wallet: user.wallet,
            transactionId: transaction._id
        });

    } catch (error) {
        console.error("Verify Deposit Payment Error:", error.message || error);
        return res.status(500).json({ success: false, message: "Failed to verify payment." });
    }
};

export const withdrawMoneyThroughRazorpayController = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await transactionModel.findById(transactionId).populate("user");
        if (!transaction || transaction.status !== "PENDING") {
            return res.status(400).json({ success: false, message: "Invalid or already processed transaction." });
        }

        const user = transaction.user;
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.wallet < transaction.amount) {
            return res.status(400).json({ success: false, message: "Insufficient wallet balance." });
        }

        // Create Razorpay Contact
        const contact = await razorpayPost('/contacts', {
            name: user.name,
            email: user.email,
            contact: user.phone || "9999999999",
            type: 'employee'
        });

        // Create Fund Account
        let fundAccount;
        if (
            transaction.bankDetails?.accountNumber &&
            transaction.bankDetails?.ifscCode &&
            transaction.bankDetails?.accountHolderName
        ) {
            fundAccount = await razorpayPost('/fund_accounts', {
                contact_id: contact.id,
                account_type: 'bank_account',
                bank_account: {
                    name: transaction.bankDetails.accountHolderName,
                    ifsc: transaction.bankDetails.ifscCode,
                    account_number: transaction.bankDetails.accountNumber,
                }
            });
        } else if (transaction.upiId) {
            fundAccount = await razorpayPost('/fund_accounts', {
                contact_id: contact.id,
                account_type: 'vpa',
                vpa: {
                    address: transaction.upiId,
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "Bank details or UPI ID are missing." });
        }

        // Create Razorpay Payout
        const razorpayPayout = await razorpayPost('/payouts', {
            account_number: '2323230016719731', // Your RazorpayX account number
            fund_account_id: fundAccount.id,
            amount: transaction.amount * 100, // in paisa
            currency: 'INR',
            mode: 'IMPS',
            purpose: 'payout',
            queue_if_low_balance: true,
        });

        // Update transaction
        transaction.status = "SUCCESS";
        transaction.razorpayPayoutId = razorpayPayout.id;
        await transaction.save();

        // Deduct wallet
        user.wallet -= transaction.amount;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Withdrawal processed successfully.",
            razorpayPayoutId: razorpayPayout.id,
            wallet: user.wallet,
        });

    } catch (error) {
        console.error("Withdraw Razorpay Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while processing withdrawal."
        });
    }
};

