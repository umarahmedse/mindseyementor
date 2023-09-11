import express from "express";
import { addContentToCourse } from "../controllers/contentController";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();

router.post(
  "/add/:id",
  protect,
  restrictTo("psychologist", "admin"),
  addContentToCourse
);
export default router;
