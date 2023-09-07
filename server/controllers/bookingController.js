import Booking from "../models/Booking.js";
export const createBooking = catchAsync(async (req, res, next) => {
  const bookingBody = {
    userId: req.body.userId,
    courseId: req.body.courseId,
    amount: req.body.amount,
  };
  const booking = await Booking.create(bookingBody);

  res.status(200).json({
    status: "success",
    course,
  });
});
