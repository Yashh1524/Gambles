import { Router } from "express";

import AuthMiddleware from "../middleware/authMiddleware.js";
import { withdrawMoneyThroughRazorpayController } from "../controllers/razorpay.controller.js";

const razorpayRoutes = Router();

razorpayRoutes.post("/withdraw-payout-razorpay", AuthMiddleware, withdrawMoneyThroughRazorpayController);

export default razorpayRoutes;
