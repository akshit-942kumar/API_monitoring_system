import express from "express";
import cors from "cors";
import monitorRoutes from "./monitorRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
const app = express();
app.use(helmet);
app.use(cors({
  origin:[
    "http://localhost:3000",
    `${process.env.FRONTEND_URL}`,
  ]
}));

const monitorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/monitors", monitorLimiter);
app.use(express.json());

app.use("/api/monitors", monitorRoutes);

app.get("/", (req, res) => {
  res.send("Monitor Service Running");
});


export default app;