import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.patch("/updatepassword", protect, updatePassword);
export default router;
