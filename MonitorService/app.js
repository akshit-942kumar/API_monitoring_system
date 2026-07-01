import express from "express";
import cors from "cors";
import monitorRoutes from "./monitorRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/monitors", monitorRoutes);

app.get("/", (req, res) => {
  res.send("Monitor Service Running");
});


export default app;