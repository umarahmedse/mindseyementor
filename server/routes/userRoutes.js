import express from "express";
import {
  deleteMe,
  getAllUser,
  getUser,
  updateMe,
} from "../controllers/userController.js";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();

router.get("/", protect, restrictTo("admin"), getAllUser);
router.get("/user/:id", protect, getUser);
router.patch("/updateme", protect, updateMe);
router.delete("/deleteme", protect, deleteMe);
export default router;
