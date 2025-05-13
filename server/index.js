import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import userRoutes from "./routes/user.route.js"
import oauthRoutes from "./routes/auth.route.js"
import betRoutes from "./routes/bet.route.js"
import razorpayRoutes from "./routes/razorpay.route.js"
import transactionRoutes from "./routes/transaction.routes.js"
import gamesRoutes from "./routes/gameRoutes/games.routes.js"

const app = express()
const port = process.env.PORT || 3000
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

// API Endpoints
app.use("/api/user", userRoutes)
app.use("/api/auth", oauthRoutes);
app.use("/api/bet", betRoutes);
app.use("/api/transaction", transactionRoutes)
app.use("/api/razorpay", razorpayRoutes)
app.use("/api/games", gamesRoutes)

app.listen(port, () => {
    console.log(`Server is running on PORT:${port}`);
})

