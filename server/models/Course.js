import mongoose from "mongoose";
import { Schema } from "mongoose";
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    tagline: {
      type: String,
      required: true,
      max: 30,
    },
    description: {
      type: String,
      required: true,
      max: 1400,
    },
    category: {
      type: String,
      enum: [
        "Cognitive Behavioral Therapy (CBT)",
        "Psychoanalytic Therapy",
        "Dialectical Behavior Therapy (DBT)",
        "Mindfulness-Based Stress Reduction (MBSR)",
        "Humanistic Therapy",
        "Art Therapy",
        "Play Therapy",
        "Gestalt Therapy",
        "Rational Emotive Behavior Therapy (REBT)",
        "Family Therapy",
        "Group Therapy",
        "Trauma-Informed Therapy",
        "Solution-Focused Brief Therapy (SFBT)",
        "Expressive Therapy",
        "Existential Therapy",
        "Narrative Therapy",
        "EMDR (Eye Movement Desensitization and Reprocessing)",
        "Psychodynamic Therapy",
        "Sandplay Therapy",
        "Music Therapy",
      ],
      required: true,
    },
    offeredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dailyHours: Number,
    noOfWeekDays: Number,
    niche: String,
    approvalStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    startDate: String,
    endDate: String,
  },

  { timestamps: true }
);
CourseSchema.virtual("contents", {
  ref: "Contents",
  localField: "_id",
  foreignField: "courseId",
});
CourseSchema.set("toJSON", { virtuals: true });
CourseSchema.set("toObject", { virtuals: true });
const Course = mongoose.model("Courses", CourseSchema);
export default Course;
