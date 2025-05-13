// routes/gameRoutes/mines.routes.js
import { 
    startMinesGame 
} from "../../controllers/gamesControllers/mines.controller.js";
import { Router } from "express";
import AuthMiddleware from "../../middleware/authMiddleware.js";

const mineRoutes = Router();

// POST /api/games/mines/start
mineRoutes.post("/start-mine", AuthMiddleware, startMinesGame);

export default mineRoutes;
