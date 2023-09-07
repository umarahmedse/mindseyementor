import express from "express";
import { createBooking } from "../controllers/bookingController";
const router = express.Router();
router.post("/new/:id", createBooking);
export default router;
