import express from "express";

import {
  addMonitor,
  getMonitors,deleteMonitor,getLogs,updateLastEmailSent
} from "./monitorController.js";

import authMiddleware from "./authMiddleware.js";

const router = express.Router();

router.post(
  "/addMonitor",
  authMiddleware,
  addMonitor
);

router.patch("/lastEmail/:id",authMiddleware,updateLastEmailSent)
router.get(
  "/getMonitors",
  authMiddleware,
  getMonitors
);
router.get(
  "/logs/:monitorId",
  authMiddleware,
  getLogs
);
router.delete(
  "/deleteMonitor/:id",
  authMiddleware,
  deleteMonitor
);
export default router;