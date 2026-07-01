import mongoose from "mongoose";
import dotenv from "dotenv";
import cron from "node-cron";

import app from "./app.js";
import {checkMonitors} from "./healthChecker.js";

dotenv.config();

const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Run every minute
    cron.schedule("* * * * *", () => {
      checkMonitors();
    });

  })
  .catch(console.log);