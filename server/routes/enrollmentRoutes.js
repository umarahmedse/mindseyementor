import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  createEnrollment,
  deleteEnrollment,
} from "../controllers/enrollmentController.js";
const router = express.Router();
router
  .post("/new/:courseId", createEnrollment)
  .delete("/delete", protect, restrictTo("admin"), deleteEnrollment);
export default router;
