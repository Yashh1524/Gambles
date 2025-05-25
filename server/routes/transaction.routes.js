import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { 
    createTransactionController, 
    getAllTransactionByUserId, 
    updateTransactionStatusController 
} from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

transactionRoutes.post("/create-transaction", AuthMiddleware, createTransactionController);
transactionRoutes.post("/update-transaction-status", AuthMiddleware, updateTransactionStatusController);
transactionRoutes.get("/get-all-transaction-by-user-id", AuthMiddleware, getAllTransactionByUserId);

export default transactionRoutes;
