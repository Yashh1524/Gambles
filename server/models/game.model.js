import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["mines", "dice", "roulette", "plinko"], // extensible
        required: true,
        unique: true,
    },
    description: String,
    image: String, // optional - use to map game icons/images on frontend
    setting: {
        type: mongoose.Schema.Types.Mixed, // e.g., { maxMines: 24, gridSize: 5 }
        default: {},
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const gameModel = mongoose.models.Game || mongoose.model("Game", gameSchema);
export default gameModel;
