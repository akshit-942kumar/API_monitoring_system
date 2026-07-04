import express from "express";

import {
  register,
  login,
  profile,
  googleLogin,
  verifyOtp,deleteAccount
} from "./autController.js";

import authMiddleware from "./authMiddleware.js";

const router = express.Router();

router.post("/signup", register);
router.post("/verify-otp", verifyOtp);

router.post("/login", login);
router.post("/google-login", googleLogin);
router.delete("/deleteUser",authMiddleware,deleteAccount)
router.get(
  "/profile",
  authMiddleware,
  profile
);

export default router;