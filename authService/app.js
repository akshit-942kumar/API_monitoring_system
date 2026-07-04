import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import authRoutes from "./authroutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
dotenv.config()
const app = express();
app.use(helmet());
app.use(cors({
  origin:[
    "http://localhost:3000",
    `${process.env.FRONTEND_URL}`,
  ]
}));
app.set("trust proxy", 1)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});
app.use("/api/auth",authLimiter)

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Auth Service Running" `at ${process.env.PORT}`);
});

export default app;