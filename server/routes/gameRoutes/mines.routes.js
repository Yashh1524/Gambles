// routes/gameRoutes/mines.routes.js
import { 
    endMinesGame,
    getPendingGame,
    revealTile,
    startMinesGame 
} from "../../controllers/gamesControllers/mines.controller.js";
import { Router } from "express";
import AuthMiddleware from "../../middleware/authMiddleware.js";

const mineRoutes = Router();

// POST /api/games/mines/start
mineRoutes.post("/start-mine", AuthMiddleware, startMinesGame);
mineRoutes.post("/end-mine", AuthMiddleware, endMinesGame);
mineRoutes.get("/pending-mine", AuthMiddleware, getPendingGame);
mineRoutes.patch("/reveal-tile", AuthMiddleware, revealTile);

export default mineRoutes;
