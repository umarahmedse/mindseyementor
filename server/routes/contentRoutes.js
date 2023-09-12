import express from "express";
import {
  addContentToCourse,
  editCourseContent,
} from "../controllers/contentController";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();

router
  .post(
    "/add/:id",
    protect,
    restrictTo("psychologist", "admin"),
    addContentToCourse
  )
  .patch(
    "/update/:id",
    protect,
    restrictTo("psychologist", "admin"),
    editCourseContent
  );
export default router;
