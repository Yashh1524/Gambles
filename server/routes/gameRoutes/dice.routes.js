// routes/gameRoutes/dice.routes.js
import { Router } from "express";
import AuthMiddleware from "../../middleware/authMiddleware.js";
import { 
    rollDiceController
} from "../../controllers/gamesControllers/dice.controller.js";

const diceRoutes = Router();

// POST /api/games/mines/start
diceRoutes.post("/roll-dice", AuthMiddleware, rollDiceController);

export default diceRoutes;
