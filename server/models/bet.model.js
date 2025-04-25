import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    gameType: {
        type: String,
        enum: ["mines", "dice", "roulette", "plinko"], // add more as you expand
        required: true
    },
    betAmount: {
        type: Number,
        required: true
    },
    winAmount: {
        type: Number,
        default: 0
    },
    isWin: {
        type: Boolean,
        default: false
    },
    gameData: {
        type: mongoose.Schema.Types.Mixed, // this will store JSON data specific to the game (e.g., for Mines:mined positions)
        default: {}
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

const betModel = mongoose.models.Bet || mongoose.model("Bet", betSchema);

export default betModel;
