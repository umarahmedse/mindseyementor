import mongoose from "mongoose";
import { Schema } from "mongoose";
const ContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title of content is required"],
    },
    link: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description of content is required"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Courses",
    },
  },

  { timestamps: true }
);
ContentSchema.set("toJSON", { virtuals: true });
ContentSchema.set("toObject", { virtuals: true });
const Content = mongoose.model("Contents", ContentSchema);
export default Content;
