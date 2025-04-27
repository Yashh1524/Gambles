import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
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
    razorpayPayoutId: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model("Payout", payoutSchema);
