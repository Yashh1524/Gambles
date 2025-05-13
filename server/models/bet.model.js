import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    game: { // Changed gameType to game that references the Game model
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game", // Referring to the Game model
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
        type: mongoose.Schema.Types.Mixed, // to store game-specific data
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
