import mongoose from "mongoose";
import { Schema } from "mongoose";
import AppError from "../utils/appError.js";
const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);
BookingSchema.pre("save", async function (next) {
  const existingBooking = await this.constructor.findOne({
    userId: this.userId,
    courseId: this.courseId,
  });

  if (existingBooking && !existingBooking._id.equals(this._id)) {
    // If a duplicate booking is found for the same user and course, prevent saving
    const error = new AppError("User is already booked into this course.", 404);
    return next(error);
  }

  next();
});
const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
