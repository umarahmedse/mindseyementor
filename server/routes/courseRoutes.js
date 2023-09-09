import express from "express";
import {
  getCourse,
  deleteCourse,
  createCourse,
  updateCourse,
  getCompleteCourse,
} from "../controllers/courseController.js";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();
router
  .get("/details/:id", protect, getCourse)
  .get("/courseDetail/:courseId", protect, getCompleteCourse)
  .delete("/:id", protect, restrictTo("admin"), deleteCourse)
  .post("/add", protect, restrictTo("admin", "psychologist"), createCourse)
  .patch(
    "/update/:id",
    protect,
    restrictTo("admin", "psychologist"),
    updateCourse
  );
export default router;
