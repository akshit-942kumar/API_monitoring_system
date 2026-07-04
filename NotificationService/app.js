import express from "express";
import cors from "cors";
import notificationRoutes from "./notificationRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
const app = express();
app.use(helmet());
app.use(cors({
  origin:[
    "http://localhost:3000",
    `${process.env.FRONTEND_URL}`,
  ]
}));
app.set("trust proxy", 1)
const notificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});
app.use("/api/notifications", notificationLimiter);
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Notification Service Running");
});

export default app;