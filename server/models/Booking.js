import mongoose from "mongoose";
import { Schema } from "mongoose";
const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Courses",
    },
    amount: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;