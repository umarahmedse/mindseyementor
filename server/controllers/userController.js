import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/User.js";

const filteredObj = (body, ...allowedFields) => {
  const resultObj = {};
  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) {
      resultObj[el] = body[el];
    }
  });
  return resultObj;
};

export const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (req.user._id != id) {
    return next(new AppError("Access To Other User UnAuthorized", 401));
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid Or Forbidden User ", 404));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }
  res.status(200).json(user);
});

export const getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({ count: user.length, data: user });
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Can't Change Password Using This Link", 401));
  }
  const filteredBody = filteredObj(
    req.body,
    "name",
    "email",
    "city",
    "state",
    "country",
    "occupation",
    "phoneNumber"
  );
  const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    user,
  });
});
export const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
  });
});
