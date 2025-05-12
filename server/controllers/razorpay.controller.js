import payoutModel from "../models/payout.model.js";
import transactionModel from "../models/transaction.model.js";
import { razorpayPost } from "../utils/razorpay.js";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createDepositOrderController = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id; // assumes you're using auth middleware

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount." });
        }

        const options = {
            amount: amount * 100, // amount in paisa
            currency: "INR",
            receipt: `receipt_${userId}_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
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

        const userId = req.user._id;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature. Payment not verified." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.wallet += amount;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Deposit successful.",
            wallet: user.wallet
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

