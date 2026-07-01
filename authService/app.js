import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import authRoutes from "./authroutes.js";
dotenv.config()
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Auth Service Running" `at ${process.env.PORT}`);
});

export default app;