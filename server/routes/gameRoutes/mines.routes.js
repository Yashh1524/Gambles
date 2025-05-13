// routes/gameRoutes/mines.routes.js
import { 
    endMinesGame,
    startMinesGame 
} from "../../controllers/gamesControllers/mines.controller.js";
import { Router } from "express";
import AuthMiddleware from "../../middleware/authMiddleware.js";

const mineRoutes = Router();

// POST /api/games/mines/start
mineRoutes.post("/start-mine", AuthMiddleware, startMinesGame);
mineRoutes.post("/end-mine", AuthMiddleware, endMinesGame);

export default mineRoutes;
