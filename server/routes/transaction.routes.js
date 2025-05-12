import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { createTransactionController } from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

transactionRoutes.post("/create-transaction", AuthMiddleware, createTransactionController);

export default transactionRoutes;
