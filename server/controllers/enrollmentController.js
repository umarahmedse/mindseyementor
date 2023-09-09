import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
export const createEnrollment = catchAsync(async (req, res, next) => {
  const enrollmentBody = {
    userId: req.body.userId,
    courseId: req.params.courseId,
    amount: req.body.amount,
  };
  const enrollment = await Enrollment.create(enrollmentBody);

  res.status(200).json({
    status: "success",
    enrollment,
  });
});

export const deleteEnrollment = catchAsync(async (req, res, next) => {
  const removingBody = {
    userEmail: req.body.userEmail,
    courseName: req.body.courseName,
  };
  const user = User.findOne({ email });
  if (!user) return next(new AppError("No User With This Id Exists"));
  const enrollment = await Enrollment.findOneAndDelete(removingBody);
  if (!enrollment)
    return next(new AppError("No Enrollment For This User Exists"));
  res.status(200).json({
    message: "Enrollment Deleted",
  });
});
