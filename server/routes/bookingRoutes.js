import express from "express";
import { createBooking } from "../controllers/bookingController.js";
const router = express.Router();
router.post("/new/:courseId", createBooking);
export default router;
