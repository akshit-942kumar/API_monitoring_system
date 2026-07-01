import express from "express";
import { sendNotification,sendOtp } from "./notificationController.js";

const router = express.Router();

router.post("/sendNotification", sendNotification);
router.post("/sendOtp", sendOtp);
export default router;