import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { 
    createTransactionController, 
    updateTransactionStatusController 
} from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

transactionRoutes.post("/create-transaction", AuthMiddleware, createTransactionController);
transactionRoutes.post("/update-transaction-status", AuthMiddleware, updateTransactionStatusController);

export default transactionRoutes;
