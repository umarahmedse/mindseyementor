import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Course from "../models/Course.js";
import Contents from "../models/Content.js";
import Enrollment from "../models/Enrollment.js";
const filteredObj = (body, ...allowedFields) => {
  const resultObj = {};
  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) {
      resultObj[el] = body[el];
    }
  });
  return resultObj;
};
export const getCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid Or Forbidden Course ", 404));
  }
  const course = await Course.findById(id).populate("offeredBy", "name email");
  if (!course) {
    return next(new AppError("Course Not Found", 404));
  }
  res.status(200).json(course);
});
export const createCourse = catchAsync(async (req, res, next) => {
  const courseBody = filteredObj(
    req.body,
    "title",
    "tagline",
    "description",
    "category",
    "dailyHours",
    "noOfWeekDays",
    "niche",
    "startDate",
    "endDate"
  );
  courseBody.offeredBy = req.user.id;
  if (req.user.role === "admin") courseBody.approvalStatus = "approved";
  const course = await Course.create(courseBody);

  res.status(200).json({
    status: "success",
    course,
  });
});
export const deleteCourse = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid Or Forbidden Course ", 404));
  }
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError("Course Not Found", 404));
  } else if (course.offeredBy !== req.user.id || req.user.role !== "admin") {
    return next(new AppError("Not Authorized to Delete", 401));
  }
  await course.deleteOne();
  res.status(200).json(course);
});
export const updateCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.body.approvalStatus = undefined;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid Or Forbidden Course ", 404));
  }

  const course = await Course.findById(id);

  // Check if the course exists
  if (!course) {
    return next(new AppError("Course Not Found", 404));
  }

  // Check if the user ID in the 'offeredBy' field matches 'req.user.id'
  if (
    course.offeredBy.toString() !== req.user.id ||
    !req.user.role === "admin"
  ) {
    return next(
      new AppError("You do not have permission to update this course", 403)
    );
  }
  const updatedCourse = await Course.findByIdAndUpdate(id, req.body);
  res.status(200).json(updatedCourse);
});

export const getCompleteCourse = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;
  const enrollment = await Enrollment.findOne({ courseId, userId });
  if (!enrollment)
    return next(
      new AppError(
        "Can't access resource , please purchase first to access",
        401
      )
    );

  const course = await Course.findById(courseId).populate("contents");
  if (!course) return next(new AppError("Course Not Found", 404));
  res.status(200).json(course);
});
