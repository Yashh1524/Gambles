import payoutModel from "../models/payout.model.js";
import userModel from "../models/user.model.js";
import { razorpayPost } from "../utils/razorpay.js";

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
