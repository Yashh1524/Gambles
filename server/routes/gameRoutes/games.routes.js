import { Router } from "express";
import minesRoutes from "./mines.routes.js";
import { 
    getAllGames
} from "../../controllers/gamesControllers/games.controller.js";

const gamesRoutes = Router();

gamesRoutes.get("/get-all-games", getAllGames)

// Mount mines-related routes under /api/games/mines
gamesRoutes.use("/mines", minesRoutes);

export default gamesRoutes;
