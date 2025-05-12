import payoutModel from "../models/payout.model.js";
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
        const { payoutId } = req.body;

        const payout = await payoutModel.findById(payoutId).populate('user');
        if (!payout || payout.status !== 'PENDING') {
            return res.status(400).json({ success: false, message: "Invalid or already processed payout." });
        }

        const user = payout.user;
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.wallet < payout.amount) {
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
        if (payout.bankDetails?.accountNumber && payout.bankDetails?.ifscCode && payout.bankDetails?.accountHolderName) {
            fundAccount = await razorpayPost('/fund_accounts', {
                contact_id: contact.id,
                account_type: 'bank_account',
                bank_account: {
                    name: payout.bankDetails.accountHolderName,
                    ifsc: payout.bankDetails.ifscCode,
                    account_number: payout.bankDetails.accountNumber,
                }
            });
        } else if (payout.upiId) {
            fundAccount = await razorpayPost('/fund_accounts', {
                contact_id: contact.id,
                account_type: 'vpa',
                vpa: {
                    address: payout.upiId,
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "Bank details or UPI ID are missing." });
        }

        // Create Razorpay Payout
        const razorpayPayout = await razorpayPost('/payouts', {
            account_number: '2323230016719731', // your RazorpayX account number
            fund_account_id: fundAccount.id,
            amount: payout.amount * 100, // Razorpay expects paisa
            currency: 'INR',
            mode: 'IMPS',
            purpose: 'payout',
            queue_if_low_balance: true,
        });

        // Update Payout
        payout.status = 'SUCCESS';
        payout.razorpayPayoutId = razorpayPayout.id;
        await payout.save();

        // Deduct user's wallet balance
        user.wallet -= payout.amount;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Withdrawal processed successfully.",
            payoutId: razorpayPayout.id,
            wallet: user.wallet
        });

    } catch (error) {
        console.error("Withdraw Money Razorpay Error:", error.message || error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while processing withdrawal."
        });
    }
};
