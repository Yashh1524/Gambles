import { Router } from "express";

import AuthMiddleware from "../middleware/authMiddleware.js";
import {
    withdrawMoneyThroughRazorpayController,
    createDepositOrderController,
    verifyDepositPaymentController
} from "../controllers/razorpay.controller.js";

const razorpayRoutes = Router();

// Withdraw Payout to Razorpay (RazorpayX)
razorpayRoutes.post("/withdraw-payout-razorpay", AuthMiddleware, withdrawMoneyThroughRazorpayController);

// Create Deposit Order
razorpayRoutes.post("/create-deposit-order", AuthMiddleware, createDepositOrderController);

// Verify Deposit Payment
razorpayRoutes.post("/verify-deposit-payment", AuthMiddleware, verifyDepositPaymentController);

export default razorpayRoutes;
