import express from "express";
import cors from "cors";
import notificationRoutes from "./notificationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Notification Service Running");
});

export default app;