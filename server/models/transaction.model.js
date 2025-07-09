import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["DEPOSIT", "WITHDRAW"],
        required: true
    },
    bankDetails: {
        accountHolderName: { type: String },
        ifscCode: { type: String },
        accountNumber: { type: String },
    },
    upiId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING"
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpayPayoutId: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
