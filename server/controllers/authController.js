import User from "../models/User.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import sendMail from "../utils/email.js";
import crypto from "crypto";
const signToken = function (userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  console.log(cookieOptions.expires);
  res.cookie("jwtMindseye", token, cookieOptions);

  // Remove password from output for create methods
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const signup = catchAsync(async (req, res, next) => {
  //Filter Out Role From Body
  const filteredObj = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => !key.includes("role"))
  );
  const newUser = await User.create(filteredObj);
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  //CHECK IF EMAIL AND PASSWORD ARE CORRECT
  if (!user || !(await user.correctPassword(password, user.password))) {
    // console.log(user.password);
    return next(new AppError("Incorrect email or password", 401));
  }
  //IF EVERYTHING IS CORRECT , SEND TOKEN TO CLIENT
  createSendToken(user, 201, res);
});

export const protect = catchAsync(async (req, res, next) => {
  //CHECKING FOR TOKEN IN HEADERS
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwtMindseye) {
    token = req.cookies.jwtMindseye;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! please log in to get access", 401)
    );
  }
  //VERIFICATION OF TOKEN VALIDITY ETC
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  //CHECK USER EXISTS NOW OR ID DELETED
  const currentUser = await User.findById(decodedData.id);
  if (!currentUser)
    return next(new AppError("User Belonging To Token No Longer Exist", 401));

  //CHECK IF USER CHANGED PASSWORD AFTER TOKEN WAS ISSUED
  if (currentUser.checkPasswordAfterToken(decodedData.iat)) {
    return next(
      new AppError("Password Changed Recently! Please Log In Again!", 401)
    );
  }
  //GRANT ACCESS
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You Dont Have Permission To Access ", 403));
    }
    next();
  };
};

export const updatePassword = catchAsync(async (req, res, next) => {
  if (
    !req.body.password ||
    !req.body.passwordConfirm ||
    !req.body.passwordCurrent
  ) {
    return next(
      new AppError(
        "Please Provide Current Password , New Password And Confirm It",
        400
      )
    );
  }
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError(
        "Your Current Password Is Wrong ! Try Resetting Password",
        401
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 201, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    throw next(new AppError("Please Provide An Email To Reset Password"), 400);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw next(new AppError("User Not Found"), 404);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); //saving instance of User , to update reset token and .save runs validators, so to skip it , we pass special object
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;
  const message = `Forgot your password? click on the link to reset - token expires in 10 minutes \n if you didn''t request for a reset , ignore this email`;
  try {
    await sendMail({
      link: resetURL,
      message,
      email: user.email,
      subject: `Password Reset Request For ${user.name}`,
    });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpiresAt = undefined);
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("there was an error sending email , try again later", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Link sent to email",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1: Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // console.log(Date.now());
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2: if token is not expired , and there is a user, change the password
  if (!user) {
    return next(new AppError("Token is Invalid Or Has Expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //3 Update ChangedPasswordAr Property
  await user.save();
  //4: log the user in (sendToken)
  createSendToken(user, 201, res);
});
