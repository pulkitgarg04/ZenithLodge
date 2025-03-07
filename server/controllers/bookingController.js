import Booking from "../models/Booking.js"
import Lodge from "../models/Lodge.js"
import asyncHandler from "../middleware/async.js"
import ErrorResponse from "../utils/errorResponse.js"

/*
  @desc    Get all bookings
  @route   GET /api/bookings
  @access  Private (Admin)
*/

export const getBookings = asyncHandler(async (req, res, next) => {
  let query

  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "lodge",
      select: "name location images price",
    })
  } else {
    query = Booking.find()
      .populate({
        path: "lodge",
        select: "name location images price",
      })
      .populate({
        path: "user",
        select: "name email",
      })
  }

  const bookings = await query

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

/*
  @desc    Get single booking
  @route   GET /api/bookings/:id
  @access  Private
*/

export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: "lodge",
    select: "name location images price description",
  })

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this booking`, 403))
  }

  res.status(200).json({
    success: true,
    data: booking,
  })
})

/*
  @desc    Create booking
  @route   POST /api/lodges/:lodgeId/bookings
  @access  Privat
*/

export const createBooking = asyncHandler(async (req, res, next) => {
  req.body.lodge = req.params.lodgeId
  req.body.user = req.user.id

  const lodge = await Lodge.findById(req.params.lodgeId)

  if (!lodge) {
    return next(new ErrorResponse(`Lodge not found with id of ${req.params.lodgeId}`, 404))
  }

  const checkIn = new Date(req.body.checkIn)
  const checkOut = new Date(req.body.checkOut)

  if (checkIn >= checkOut) {
    return next(new ErrorResponse("Check-out date must be after check-in date", 400))
  }

  if (checkIn < new Date()) {
    return next(new ErrorResponse("Check-in date cannot be in the past", 400))
  }

  const existingBooking = await Booking.findOne({
    lodge: req.params.lodgeId,
    $or: [
      {
        checkIn: { $lte: checkOut },
        checkOut: { $gte: checkIn },
      },
    ],
  })

  if (existingBooking) {
    return next(new ErrorResponse("Lodge is already booked for the selected dates", 400))
  }

  const booking = await Booking.create(req.body)

  res.status(201).json({
    success: true,
    data: booking,
  })
})

/*
  @desc    Update booking
  @route   PUT /api/bookings/:id
  @access  Private
*/

export const updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 403))
  }

  delete req.body.lodge
  delete req.body.user

  if (booking.status === "cancelled" || booking.status === "completed") {
    return next(new ErrorResponse(`Booking cannot be updated because it is ${booking.status}`, 400))
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: booking,
  })
})

/*
  @desc    Cancel booking
  @route   PUT /api/bookings/:id/cancel
  @access  Private
*/

export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404))
  }

  if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this booking`, 403))
  }

  if (booking.status === "cancelled") {
    return next(new ErrorResponse("Booking is already cancelled", 400))
  }

  if (booking.status === "completed") {
    return next(new ErrorResponse("Cannot cancel a completed booking", 400))
  }

  booking.status = "cancelled"

  if (booking.paymentStatus === "paid") {
    booking.paymentStatus = "refunded"
  }

  await booking.save()

  res.status(200).json({
    success: true,
    data: booking,
  })
})

/*
  @desc    Get bookings for a lodge
  @route   GET /api/lodges/:lodgeId/bookings
  @access  Private (Manager, Admin)
*/

export const getLodgeBookings = asyncHandler(async (req, res, next) => {
  const lodge = await Lodge.findById(req.params.lodgeId)

  if (!lodge) {
    return next(new ErrorResponse(`Lodge not found with id of ${req.params.lodgeId}`, 404))
  }

  if (lodge.manager.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view bookings for this lodge`, 403))
  }

  const bookings = await Booking.find({ lodge: req.params.lodgeId }).populate({
    path: "user",
    select: "name email",
  })

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})