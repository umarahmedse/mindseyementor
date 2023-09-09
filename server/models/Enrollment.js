import mongoose from "mongoose";
import { Schema } from "mongoose";
import AppError from "../utils/appError.js";
const EnrollmentSchema = new mongoose.Schema(
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
EnrollmentSchema.pre("save", async function (next) {
  const existingEnrollment = await this.constructor.findOne({
    userId: this.userId,
    courseId: this.courseId,
  });

  if (existingEnrollment && !existingEnrollment._id.equals(this._id)) {
    // If a duplicate booking is found for the same user and course, prevent saving
    const error = new AppError(
      "User is already enrolled into this course.",
      404
    );
    return next(error);
  }

  next();
});
const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;
