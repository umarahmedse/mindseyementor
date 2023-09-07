import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        //this only works on save & create
        validator: function (el) {
          return this.password === el;
        },
        message: "Passwords Are Not The Same",
      },
    },
    passwordResetExpires: {
      type: Date,
    },
    city: String,
    state: String,
    country: String,
    occupation: String,
    phoneNumber: String,
    transactions: Array,
    role: {
      type: String,
      enum: ["user", "psychologist", "admin"],
      default: "user",
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

/* METHODS AND MONGOOSE MIDDLEWARES */
//Query Middlewares
UserSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//Encryption Of Password On Create/Save Method
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});
//ChangePasswordAt property
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 10000;
  next();
});
//Check password In Login
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//Check For PasswordChanged After Token Issued
UserSchema.methods.checkPasswordAfterToken = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime());
    //converting to ms & parsing as int
    return JWTTimeStamp * 1000 < changedTimestamp;
  }

  return false;
};

//Reset Token Creation
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10min
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return resetToken; //send via email
};
// Virtual Poplation Of Purchased Courses
UserSchema.virtual("enrolledCourses", {
  ref: "Booking",
  localField: "_id",
  foreignField: "userId",
});
const User = mongoose.model("User", UserSchema);
export default User;
