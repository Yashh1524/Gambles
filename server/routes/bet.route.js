import { Router } from "express";

import AuthMiddleware from "../middleware/authMiddleware.js";
import { createBetController, getAllBetsController, getUserBetsByGameController, getUserBetsController, updateBetController } from "../controllers/bet.controller.js";

const betRoutes = Router();

betRoutes.post("/create-bet", AuthMiddleware, createBetController);
betRoutes.get("/fetch-all-bet", AuthMiddleware, getAllBetsController);
betRoutes.post("/fetch-bets-by-user", AuthMiddleware, getUserBetsController);
betRoutes.post("/fetch-user-bet-by-game", AuthMiddleware, getUserBetsByGameController);
betRoutes.put("/update-bet/:betId", AuthMiddleware, updateBetController);

export default betRoutes;
