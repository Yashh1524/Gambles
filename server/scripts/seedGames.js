// scripts/seedGames.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import gameModel from "../models/game.model";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

await gameModel.create({
    name: "mines",
    displayName: "Mines",
    settings: {
        gridSize: 25,
        maxMines: 24,
        minMines: 1
    }
});

console.log("Game seeded ✅");
process.exit();
