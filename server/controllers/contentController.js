import catchAsync from "../utils/catchAsync.js";
import Course from "../models/Course.js";
import AppError from "../utils/appError.js";
import Content from "../models/Content.js";
export const addContentToCourse = catchAsync(async (req, res, next) => {
  const courseId = req.params.id;
  const contentBody = req.body;
  contentBody.courseId = courseId;
  const course = await Course.findById(courseId);
  if (
    course.offeredBy.toString() !== req.user.id ||
    req.user.role !== "admin"
  ) {
    return next(
      new AppError(
        "You Don't Have Permission To Add Content To This Course",
        401
      )
    );
  }
  const content = await Content.create(contentBody);

  res.status(200).json({
    status: "success",
    content,
  });
});
