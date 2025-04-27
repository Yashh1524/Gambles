import { Router } from "express";

import AuthMiddleware from "../middleware/authMiddleware.js";
import { createPayOutController } from "../controllers/payout.controller.js";

const payoutRoutes = Router();

payoutRoutes.post("/create-payout", AuthMiddleware, createPayOutController);

export default payoutRoutes;
