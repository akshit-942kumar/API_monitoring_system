import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);
app.use(cors({
  origin:[
    "http://localhost:3000",
    `${process.env.FRONTEND_URL}`,
  ]
}));

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: `${process.env.AUTH_SERVICE}/api/auth`,
    changeOrigin: true,
  })
);

app.use(
  "/api/monitors",
  createProxyMiddleware({
    target: `${process.env.MONITOR_SERVICE}/api/monitors`,
    changeOrigin: true,
  })
);

app.use(
  "/api/notifications",
  createProxyMiddleware({
    target: `${process.env.NOTIFICATION_SERVICE}/api/notifications`,
    changeOrigin: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

export default app;