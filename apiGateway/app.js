import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

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