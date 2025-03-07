import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
  checkIn: {
    type: Date,
    required: [true, "Please add a check-in date"],
  },
  checkOut: {
    type: Date,
    required: [true, "Please add a check-out date"],
  },
  guests: {
    type: Number,
    required: [true, "Please add number of guests"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Please add total price"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer"],
    required: [true, "Please add payment method"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  lodge: {
    type: mongoose.Schema.ObjectId,
    ref: "Lodge",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

BookingSchema.index({ lodge: 1, checkIn: 1, checkOut: 1 }, { unique: true })

BookingSchema.pre("save", async function (next) {
  if (!this.isModified("checkIn") && !this.isModified("checkOut") && this.totalPrice) {
    return next()
  }

  try {
    const Lodge = mongoose.model("Lodge")
    const lodge = await Lodge.findById(this.lodge)

    if (!lodge) {
      throw new Error("Lodge not found")
    }

    const checkIn = new Date(this.checkIn)
    const checkOut = new Date(this.checkOut)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

    if (nights <= 0) {
      throw new Error("Check-out date must be after check-in date")
    }

    this.totalPrice = lodge.price * nights
    next()
  } catch (error) {
    next(error)
  }
})

export default mongoose.model("Booking", BookingSchema)

