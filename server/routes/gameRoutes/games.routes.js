import { Router } from "express";
import minesRoutes from "./mines.routes.js";

const gamesRoutes = Router();

// Mount mines-related routes under /api/games/mines
gamesRoutes.use("/mines", minesRoutes);

export default gamesRoutes;
