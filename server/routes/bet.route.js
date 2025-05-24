import { Router } from "express";

import AuthMiddleware from "../middleware/authMiddleware.js";
import { 
    createBetController, 
    getAllBetsController, 
    getUserBetsByGameController, 
    getUserBetsController, 
    getUserTotalWinningAmountAndWinningStreak, 
    getUserTotalWinningAmountAndWinningStreakByGame, 
    updateBetController 
} from "../controllers/bet.controller.js";

const betRoutes = Router();

betRoutes.post("/create-bet", AuthMiddleware, createBetController);
betRoutes.get("/fetch-all-bet", AuthMiddleware, getAllBetsController);
betRoutes.get("/fetch-bets-by-user", AuthMiddleware, getUserBetsController);
betRoutes.post("/fetch-user-bet-by-game", AuthMiddleware, getUserBetsByGameController);
betRoutes.put("/update-bet/:betId", AuthMiddleware, updateBetController);
betRoutes.get("/get-user-totalwin-and-winningstreak", AuthMiddleware, getUserTotalWinningAmountAndWinningStreak);
betRoutes.get("/get-user-totalwin-and-winningstreak-by-game", AuthMiddleware, getUserTotalWinningAmountAndWinningStreakByGame);

export default betRoutes;
